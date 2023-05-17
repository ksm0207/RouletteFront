<template>
  <div>
    <h4>Canvas</h4>
    <div>
      <span v-for="(item,index) in items">{{item}} <button @click="deleteItem(index)">x</button></span>
    </div>
    <div>
      <input type="text" v-model="text"/>
<!--      <button v-on:click="addItem()">생성</button>-->
    </div>
    <canvas id="myCanvas" width="800" height="300"></canvas>
    <div>
      <button v-on:click="createSegments()">Create Segments!</button>
      <button v-on:click="refreshSegments()">Refresh Segments!</button>
      <button v-on:click="rouletteStart">Roulette Start</button>
    </div>
  </div>
</template>

<script>
import Winwheel from 'winwheel';
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      items : [], // [생성] 버튼 클릭 후 항목담는 데이터
      text : null, // 항목 저장
      theWheel: null, // 돌림판 인스턴스
      makeSegments: 0
    }
  },

  methods: {
    // 항목생성하기
    // addItem () {
    //   let dataYn = false
    //   if(this.text !== null){
    //     // this.items.push(this.text)
    //   }else{
    //     Swal.fire('돌림판에 추가 할 항목을 생성하세요.')
    //     return dataYn
    //   }
    //   console.log("Add Items ! " , this.items)
    //   return this.items
    // },
    deleteItem(index) {
      // TODO index
      console.log("remove "+ this.items[index]);
      this.items.splice(index, 1)
      this.text = this.items.join(",")

      this.createSegments()
    },
    createSegments() {
      // ys
      this.items = this.text.split(',');

      console.log("createSegments () Get Items : " , this.items)
      if(this.items.length <= 2) {
        Swal.fire('최소 3가지 항목을 추가해주세요.')
        return false
      }
      // 아이템 길이만큼 생성 할 돌림판 count value
      const numSegmentsToAdd = parseInt(this.items.length);
      // 돌림판 생성v
      if (numSegmentsToAdd > 0) {
        this.createWheel(numSegmentsToAdd , this.items);
      }
    },
    // Canvas 그리기
    createWheel(numSegments, object) {
      this.theWheel = new Winwheel({
        'canvasId': 'myCanvas',
        'numSegments': numSegments,
        'segments': this.generateSegments(numSegments , object)
      });
    },
    // 데이터 생성하기
    generateSegments(numSegments, object) {
      console.log("generateSegments !" , object)
      const segments = [];
      if(object ===  undefined){
        console.log("True")
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
      console.log(this.theWheel)
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
      console.log("bing bing...")
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
