<template>
  <div>
    <h4>Canvas</h4>
    <div v-if="item !== null">
      <span v-for="(item,index) in items">
        {{item}}
        <button @click="deleteItem(index)">x</button>
      </span>
    </div>
    <div>
      <input type="text" v-model="text" />
    </div>
    <canvas id="myCanvas" width="600" height="400"></canvas>
    <div>
      <el-button type="primary" v-on:click="createSegments()">Create Segments!</el-button>
      <el-button type="primary" v-on:click="refreshSegments()">Create Segments!</el-button>
      <el-button type="primary" v-on:click="rouletteStart()">Create Segments!</el-button>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import Winwheel from 'winwheel';
import { TweenMax } from 'gsap/all'
import Swal from 'sweetalert2'
import axios from 'axios'

export default {
  data() {

    return {

      items : [], // [생성] 버튼 클릭 후 항목담는 데이터
      text : "1,2,3,4,5,6,7,8", // 항목 저장
      theWheel: null, // 돌림판 인스턴스
      makeSegments: 0

    }
  },

  methods: {

    deleteItem(index) {
      // TODO index
      this.items.splice(index, 1)
      this.text = this.items.join(",")
      this.createSegments()
    },

    createSegments() {
      // ys
      this.items = this.text.split(',');
      if(this.items.length <= 2) {
        Swal.fire('최소 3가지 항목을 추가해주세요.')
        return false
      }
      // 아이템 길이만큼 생성 할 돌림판 count value
      const numSegmentsToAdd = parseInt(this.items.length);
      // 돌림판 생성
      if (numSegmentsToAdd > 0) {
        this.createWheel(numSegmentsToAdd , this.items);
      }
    },
    // Canvas 그리기
    createWheel(numSegments, object) {
      if(object == null) {
        this.theWheel = new Winwheel({
        'canvasId': 'myCanvas',
        'numSegments': numSegments,
        'segments': this.generateSegments(numSegments , object),
      });
      }else{
        this.theWheel = new Winwheel({
        'canvasId': 'myCanvas',
        'numSegments': numSegments,
        'segments': this.generateSegments(numSegments , object),
        'outerRadius'    : 170,
        'pointerAngle' : 90,
        'pointerGuide' : {
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
      if(object ===  undefined){
        for (let i = 1; i <= numSegments; i++) {
          segments.push({
            'fillStyle': this.getRandomColor(),
            'text': ``
          });
        }
      }else{
        for (let i = 0; i <= numSegments; i++) {
          segments.push({
            'fillStyle': this.getRandomColor(),
            'text': object[i]
            // 'text': ''
          });
        }
      }
      return segments;
    },
    //랜덤컬러
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    // 새로고침
    // TODO : 새로고침 클릭 후 배열의 길이 어떻게 할지 고려하기
    refreshSegments () {
      let defaultSegments = 2
      if(this.theWheel.numSegments > 2) {
        this.createWheel(defaultSegments)
      }else{
        Swal.fire({
          'title' : 'Test',
        })
      }
    },
    rouletteStart () {
      if(this.items.length === 0 || this.items.length < 3) {
        Swal.fire({'title' : '항목을 추가하세요.'});
        return false
      }else{
        this.theWheel.startAnimation(false)
        this.theWheel.rotationAngle = 0
        const animation = {
          'type'     : 'spinToStop',
          'duration' : 5,
          'spins'    : 8,
        };
        this.theWheel.animation = animation;
        this.theWheel.startAnimation();
        this.callbackAlertPrize(this.alertPrize)
      }
    },

    alertPrize() {
      let status = 200;

      const winningSegment = this.theWheel.getIndicatedSegment();
      const index = this.theWheel.segments.indexOf(winningSegment);
      const position = index ;

      let winningSegmentNumber = this.theWheel.getIndicatedSegmentNumber();
      for (let x = 1; x < this.theWheel.segments.length; x ++) {
        this.theWheel.segments[x].fillStyle = 'gray';
      }

      this.theWheel.segments[winningSegmentNumber].fillStyle = 'white';
      this.theWheel.draw();

      Swal.fire({
        title: `Index >>> ${position} : ${winningSegment.text} \n Do you want Save ? ` ,
        showDenyButton : true,
        icon: 'success'
      })
      .then((result => {
        if(result.isConfirmed) {
          console.log("Save")
          this.onSave()
          // if (status === 200) {
          //   Swal.fire('Success!','Data Save','success')
          // }
        }else {
          console.log("Not Save")
          return false;
        }

      }))
    },

    callbackAlertPrize (callback) {
      setTimeout(() => {
        const result = callback;
        callback(result); // 콜백 함수 호출
      }, 4500);
    },

    drawTriangle() {
      let ctx = this.theWheel.ctx
      ctx.strokeStyle = 'navy';     // Set line colour.
      ctx.fillStyle   = 'aqua';     // Set fill colour.
      ctx.lineWidth   = 2;
      ctx.beginPath();              // Begin path.
      ctx.moveTo(170, 5);           // Move to initial position.
      ctx.lineTo(230, 5);           // Draw lines to make the shape.
      ctx.lineTo(200, 40);
      ctx.lineTo(171, 5);
      ctx.stroke();                 // Complete the path by stroking (draw lines).
      ctx.fill();                   // Then fill.
    },

    alertTest () {
      Swal.fire({
        title : 'Do you want to data ?',
        showDenyButton : true,
      })
      .then((result) =>{

      })
    },

    async apiTest () {
      await axios.post('/roule/front')
      .then(response =>{
        console.log("Reponse : " , response)
      })
      .catch(error =>{
        console.log("Error" , error)
      })
    },
    async onSave() {
      const data = {
        'item_list' : this.text,
        'item_result' : '5'
      }
      await axios.post('/roule/front/roulette', data)
      .then(response => {
        console.log("Data Save!" , response)
      })
      .catch(error =>{
        console.log("Save Error... " , error)
      })
    }

  },



  mounted() {
    this.createWheel(2); // Initial number of segments
  },
}
</script>

<style >
.swal2-title {
  font-size: 20px;
}

</style>
