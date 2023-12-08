<script setup lang="ts">
import * as handTrack from 'handtrackjs'
import '@ar-js-org/ar.js/aframe/build/aframe-ar'

import useSleep from '@/utils/hooks/useSleep'

var handTrackModel;

const scene = ref();
const camera = ref();

// back

const onClickLeft = () => {
  handTrackModel?.dispose();
  history.back()
}

//detectHandle
const detectHandle = async (video: HTMLElement) => {
  const predictions = await handTrackModel.detect(video);
  if (predictions.length > 0) {
    //获取手部位置
    const handPosition = predictions[0].bbox;

    console.log('detectHandle', predictions);


    //更新camera位置
    camera.value.setAttribute('position', {
      x: handPosition[0],
      y: handPosition[1],
      z: handPosition[2]
    })
  }
}

//trackhand
const trackhand = async (video: HTMLElement) => {
  const defaultParams = {
    flipHorizontal: false,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "large",
    bboxLineWidth: "2",
    fontSize: 17,
  }
  handTrackModel = await handTrack.load(defaultParams)
  setInterval(() => {
    detectHandle(video)
  }, 1000 / 30) //每秒30帧
}

//init
const init = async () => {
  const video = document.getElementById('arjs-video')
  console.log('video', video);
  const res = await handTrack.startVideo(video);
  if (res.status) trackhand(video);
  else console.error(`${res.msg}`);
}

const unloadHandle = async () => {
  handTrackModel?.dispose();
  document.body.classList.toggle('arjs')
  //重置ar相关事件等
  location.reload();
  await useSleep(1000)
}

onBeforeMount(() => {
  document.body.classList.toggle('arjs')
})

onMounted(() => {
  //防止页面Ar相关配置未加载完成，导致handtrack无法挂载video
  setTimeout(() => {
    init()
  },100)
})

onBeforeUnmount(unloadHandle)

</script>



<template>
  <VanNavBar title="🍉 AR Test" left-arrow fixed @click-left="onClickLeft" />

  <div class="container">

    <div class="data-label">

      AR测试

    </div>

    <div>

      <a-scene vr-mode-ui="enabled: false" embedded arjs ref="scene">

        <a-entity ref="camera" camera></a-entity>

      </a-scene>

    </div>

    <!-- <div class="data-content">

      <div v-if="messages.length">

        <span v-for="(item, index) in messages" :key="index">{{ item }}</span>

      </div>

      <VanEmpty v-else description="暂无数据" />

    </div> -->

    <!-- <VanButton round block type="primary" @click="pull">

      请求

    </VanButton>

    <VanButton round block type="default" @click="reset">

      清空

    </VanButton> -->

  </div>
</template>

<style lang="less" scoped>
.container {

  width: 100%;

  height: 100%;

  padding: 74px 30px;

  .data-label {

    color: #969799;

    font-weight: 400;

    font-size: 14px;

    line-height: 16px;

  }

  .data-content {

    height: 300px;

    padding: 20px;

    line-height: 30px;

    background: #fff;

    margin-top: 20px;

    border-radius: 15px;

    display: flex;

    align-items: center;

    justify-content: center;

  }

}

[data-theme='dark'] {

  .data-content {

    background: #222;

    color: #fff;

  }

}

.van-button--block {

  margin-top: 15px;

}
</style>