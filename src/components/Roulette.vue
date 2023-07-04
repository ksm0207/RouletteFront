<template>
  <div class="router-wrapper">
    <div class="roulette-wrapper">
      <canvas id="myCanvas" width="400" height="400"></canvas>
      <span class="pin"> ◀︎ </span>
    </div>

    <div v-if="item !== null" class="item-list">
      <span v-for="(item, index) in items" class="item">
        {{ item }}
        <el-button class="delete-button" size="mini" @click="deleteItem(index)">x</el-button>
      </span>
    </div>

    <div>
      <el-input class="el-input--large mr-20" type="text" v-model="text" placeholder="여기에 항목을 입력하세요. (ex 딸기,사과,망고,...)" />
      <el-button type="warning" v-on:click="createSegments()">룰렛판 생성</el-button>
      <el-button type="warning" v-on:click="changeColorSet()">컬러 {{ colorSet.name }}</el-button>
    </div>

    <div>
      <el-button type="primary" v-on:click="rouletteStart()">룰렛 돌리기</el-button>
      <el-button id="resultViewText" type="primary" v-on:click="rouletteResultView()">룰렛 현황보기</el-button>
      <el-button type="primary" v-on:click="refreshSegments()">룰렛 새로고침</el-button>
      <el-button type="primary" v-on:click="showGuestBookView()">방명록</el-button>
    </div>
    <div></div>
    <div>
      <RouletteResult v-show="resultViewOnOff" :resultAllList="this.resultAllList" />
    </div>
  </div>
</template>

<script>
import Winwheel from 'winwheel';
import { TweenMax } from 'gsap/all';
import Swal from 'sweetalert2';
import axios from 'axios';

import RouletteResult from './RouletteResult.vue';

export default {
  data() {
    return {
      items: [], // [생성] 버튼 클릭 후 항목담는 데이터
      text: null, // 항목 저장
      itemResult: null, // 당첨된 아이템
      theWheel: null, // 돌림판 인스턴스
      makeSegments: 0,
      resultViewOnOff: false, // 룰렛결과보기 on/off
      resultAllList: [],
      anonymous: null, // 익명 사용자
      colorSet: { name: '기본', type: null } // null : default / rainbow / pastel
    };
  },

  components: {
    RouletteResult: RouletteResult
  },

  methods: {
    deleteItem(index) {
      // TODO index
      if (index < 3) {
        Swal.fire('pass');
        return false;
      }
      this.items.splice(index, 1);
      this.text = this.items.join(',');

      this.createSegments();
    },

    createSegments() {
      // ys
      this.items = this.text.split(',');
      if (this.items.length <= 2) {
        Swal.fire('최소 3가지 항목을 추가해주세요.');
        return false;
      }
      // 아이템 길이만큼 생성 할 돌림판 count value
      const numSegmentsToAdd = parseInt(this.items.length);
      // 돌림판 생성
      if (numSegmentsToAdd > 0) {
        this.createWheel(numSegmentsToAdd, this.items);
      }
    },
    // Canvas 그리기
    createWheel(numSegments, object) {
      if (object == null) {
        this.theWheel = new Winwheel({
          canvasId: 'myCanvas',
          numSegments: numSegments,
          segments: this.generateSegments(numSegments, object)
        });
      } else {
        this.theWheel = new Winwheel({
          canvasId: 'myCanvas',
          numSegments: numSegments,
          segments: this.generateSegments(numSegments, object),
          outerRadius: 200,
          pointerAngle: 90,
          pointerGuide: {
            // 'display' : true,
            // 'strokeStyle' : '',
            // 'lineWidth' : 2
          }
        });
      }
    },
    // 데이터 생성하기
    generateSegments(numSegments, object) {
      const segments = [];
      if (object === undefined) {
        for (let i = 1; i <= numSegments; i++) {
          segments.push({
            fillStyle: this.getRandomColor(i, numSegments),
            // fillStyle: this.getRandomColor(),
            text: ``
          });
        }
      } else {
        for (let i = 0; i <= numSegments; i++) {
          segments.push({
            fillStyle: this.getRandomColor(i, numSegments),
            // fillStyle: this.getRandomColor(),
            text: object[i]
            // 'text': ''
          });
        }
      }
      return segments;
    },

    changeColorSet() {
      const list = [
        { name: '기본', type: null },
        { name: 'Rainbow', type: 'rainbow' },
        { name: '파스텔', type: 'pastel' }
      ];
      this.colorSet = list[Math.floor(Math.random() * 3)];

      if (this.items.length > 0) {
        this.createSegments();
      } else {
        this.createWheel(3);
      }
    },

    //랜덤컬러
    getRandomColor(i, numSegments) {
      switch (this.colorSet.type) {
        case 'pastel':
          return 'hsl(' + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (70 + 10 * Math.random()) + '%)';
        case 'rainbow':
          return this.getRainbowRandomColor(i, numSegments);
        default:
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
      }
    },

    getRainbowRandomColor(i, length) {
      let hue = Math.floor((i / length) * 341); // between 0 and 340
      let saturation = 100;
      let lightness = 50;

      // color adjustment:
      if (hue > 215 && hue < 265) {
        const gain = 20;
        let blueness = 1 - Math.abs(hue - 240) / 25;
        let change = Math.floor(gain * blueness);
        lightness += change;
        saturation -= change;
      }
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
    // 새로고침
    // TODO : 새로고침 클릭 후 배열의 길이 어떻게 할지 고려하기
    refreshSegments() {
      let defaultSegments = 3;
      if (this.theWheel.numSegments > 2) {
        this.createWheel(defaultSegments);
        this.item = null;
      } else {
        Swal.fire({
          title: 'Test'
        });
      }
    },
    rouletteStart() {
      if (this.items.length === 0 || this.items.length < 3) {
        Swal.fire({ title: '항목을 추가하세요.' });
        return false;
      } else {
        this.theWheel.startAnimation(false);
        this.theWheel.rotationAngle = 0;
        const animation = {
          type: 'spinToStop',
          duration: 5,
          spins: 8
        };
        this.theWheel.animation = animation;
        this.theWheel.startAnimation();
        this.callbackAlertPrize(this.alertPrize);
      }
    },

    alertPrize() {
      const winningSegment = this.theWheel.getIndicatedSegment();
      const index = this.theWheel.segments.indexOf(winningSegment);

      let winningSegmentNumber = this.theWheel.getIndicatedSegmentNumber();
      for (let x = 1; x < this.theWheel.segments.length; x++) {
        this.theWheel.segments[x].fillStyle = 'gray';
      }

      this.theWheel.segments[winningSegmentNumber].fillStyle = 'gold';
      this.theWheel.draw();
      this.itemResult = winningSegment.text;
      Swal.fire({
        title: `당첨 : ${this.itemResult} \n  결과를 저장할까요 ?`,
        showDenyButton: true,
        icon: 'success'
      }).then(result => {
        if (result.isConfirmed) {
          const saveResult = this.onSave();
          if (saveResult.status === 200) {
            // 저장 후 처리할 로직 생각하기
          }
        } else {
          return false;
        }
      });
    },

    callbackAlertPrize(callback) {
      setTimeout(() => {
        const result = callback;
        callback(result); // 콜백 함수 호출
      }, 4500);
    },

    drawTriangle() {
      let ctx = this.theWheel.ctx;
      ctx.strokeStyle = 'navy'; // Set line colour.
      ctx.fillStyle = 'aqua'; // Set fill colour.
      ctx.lineWidth = 2;
      ctx.beginPath(); // Begin path.
      ctx.moveTo(170, 5); // Move to initial position.
      ctx.lineTo(230, 5); // Draw lines to make the shape.
      ctx.lineTo(200, 40);
      ctx.lineTo(171, 5);
      ctx.stroke(); // Complete the path by stroking (draw lines).
      ctx.fill(); // Then fill.
    },
    async onSave() {
      const data = {
        item_list: this.text,
        item_result: this.itemResult,
        name: this.anonymous
      };
      await axios
        .post('/roule/front/roulette', data)
        .then(response => {
          console.log('Data Save!', response);
        })
        .catch(error => {
          console.log('Save Error... ', error);
        });
    },
    async rouletteResultView() {
      await axios
        .post('/roule/front/roulette/result', null)
        .then(response => {
          if (response.data.length > 0) {
            this.resultAllList = response.data;
            this.viewYn();
          } else {
            Swal.fire('결과가 없습니다.');
            return false;
          }
        })
        .catch(error => {
          console.log('결과에러 : ', error);
        });
    },
    viewYn() {
      let buttonElement = document.getElementById('resultViewText');
      let spanElement = buttonElement.querySelector('span');
      if (spanElement !== null) {
        spanElement.innerText = '룰렛 현황닫기';
        this.resultViewOnOff = !this.resultViewOnOff;
      }
      if (!this.resultViewOnOff) spanElement.innerText = '룰렛 현황보기';
    },
    showGuestBookView() {
      const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const windowWidth = 400;
      const windowHeight = 400;
      const left = (screenWidth - windowWidth) / 2;
      const top = (screenHeight - windowHeight) / 2;
      const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`;
      window.open('/guestBook', 'Guestbook', windowFeatures);
    }
  },
  mounted() {
    this.createWheel(3); // Initial number of segments
  }
};
</script>

<style>
.swal2-title {
  font-size: 20px;
}

.router-wrapper {
  padding: 50px;
}

.roulette-wrapper {
  position: relative;
  width: 500px;
  height: 400px;
  padding: 50px 0;
}

.pin {
  font-size: 3rem;
  position: absolute;
  left: 415px;
  top: 50%;
  transform: translate(-100%, -50%);
}

.item-list {
  display: flex;
  flex-wrap: wrap;
}

.item {
  display: flex;
  align-items: center;
  padding: 5px;
  margin-right: 20px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.delete-button {
  margin-left: 5px;
}

.el-input--large {
  width: 500px;
  padding: 20px 0;
}

.mr-20 {
  margin-right: 20px;
}
</style>
