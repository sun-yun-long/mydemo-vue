<!--
 * @Description: 
 * @Author: 
 * @Date: 2022-11-02 15:41:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-18 10:13:38
-->
<template>
  <div class="shell">
    <!-- 外层容器 -->
    <div class="box">
      <!-- 盒子容器 -->
      <div class="images">
        <!-- 图片容器 -->
        <img src="@/assets/logo.png" />
        <!-- 显示item1.jpg图片 -->
      </div>
      <div class="content">
        <!-- 内容容器 -->
        <h2>ZeenChin</h2>
        <!-- 标题为ZeenChin -->
        <p>The style in the painting integrates temptation, fantasy and strangeness</p>
        <!-- 段落内容描述绘画风格 -->
      </div>
    </div>
    <!-- 后续box结构与前面类似，每个box包含图片和内容 -->
    <div class="box">
      <div class="images">
        <img src="@/assets/logo.png" />
      </div>
      <div class="content">
        <h2>ZeenChin</h2>
        <p>The style in the painting integrates temptation, fantasy and strangeness</p>
      </div>
    </div>
    <div class="box">
      <div class="images">
        <img src="@/assets/logo.png" />
      </div>
      <div class="content">
        <h2>ZeenChin</h2>
        <p>The style in the painting integrates temptation, fantasy and strangeness</p>
      </div>
    </div>
    <div class="box">
      <div class="images">
        <img src="@/assets/logo.png" />
      </div>
      <div class="content">
        <h2>ZeenChin</h2>
        <p>The style in the painting integrates temptation, fantasy and strangeness</p>
      </div>
    </div>
    <div class="box">
      <div class="images">
        <img src="@/assets/logo.png" />
      </div>
      <div class="content">
        <h2>ZeenChin</h2>
        <p>The style in the painting integrates temptation, fantasy and strangeness</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  /* 将内容区域居中显示 */
  display: flex;
  /* 使用 Flex 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  min-height: 100vh;
  /* 最小高度占据整个视口 */
  /* 设置背景渐变色 */
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
}

.shell {
  /* 设置相对定位，启用3D变换 */
  position: relative;
  /* 最小宽度为1000像素 */
  min-width: 1000px;
  /* 使用 Flex 布局 */
  display: flex;
  /* 水平居中 */
  justify-content: center;
  /* 换行排列子元素 */
  flex-wrap: wrap;
  /* 保持3D变换 */
  transform-style: preserve-3d;
  /* 设置透视效果 */
  perspective: 900px;
  margin-top: 100px;
}

.shell .box {
  /* 设置相对定位和固定宽高 */
  position: relative;
  /* 宽度250像素 */
  width: 250px;
  /* 高度350像素 */
  height: 350px;
  /* 过渡效果时长 */
  transition: 0.6s;
  /* 隐藏溢出部分 */
  overflow: hidden;
  /* 外边距为30像素 */
  margin: 30px;
  /* 默认Y轴旋转角度为0度 */
  transform: rotateY(0deg);
  /* 过渡延迟0.1秒 */
  transition-delay: 0.1s;
  /* 设置圆角为5像素 */
  border-radius: 5px;
  /* 边框为白色5像素实线 */
  border: #fff 5px solid;
}

/* 鼠标悬停在 .shell 上时 */
.shell:hover .box {
  /* 所有 .box 元素绕Y轴旋转20度 */
  transform: rotateY(20deg);
}

/* 鼠标悬停在 .box 上时 */
.shell .box:hover {
  /* 当前 .box 元素恢复到0度旋转并放大到1.25倍 */
  transform: rotateY(0deg) scale(1.25);
  /* 添加阴影效果 */
  box-shadow: 0 25px 40px rgba(0, 0, 0, 0.7);
  /* 设置堆叠顺序为1，使其位于最顶层 */
  z-index: 1;
}

/* 鼠标悬停在 .box 上时，其他 .box 元素的效果 */
.shell .box:hover ~ .box {
  /* 其他 .box 元素绕Y轴反向旋转20度 */
  transform: rotateY(-20deg);
}

.shell .box .images img {
  /* 图片宽度100% */
  width: 100%;
}

.shell .box .content {
  /* 绝对定位 */
  position: absolute;
  /* 顶部与父元素对齐 */
  top: 0;
  /* 宽度90% */
  width: 90%;
  /* 高度100% */
  height: 100%;
  /* 设置堆叠顺序为999，使内容层位于最顶层 */
  z-index: 999;
  /* 内边距为15像素 */
  padding: 15px;
}

.shell .box .content h2 {
  /* 设置标题颜色 */
  color: rgb(210, 140, 140);
  /* 过渡效果时长 */
  transition: 0.6s;
  /* 字体大小20像素 */
  font-size: 20px;
  /* 初始位置向上偏移100像素 */
  transform: translateY(-100px);
}

/* 鼠标悬停在 .box 上时的标题效果 */
.shell .box:hover .content h2 {
  /* 标题向上偏移15像素 */
  transform: translateY(-15px);
}

.shell .box .content p {
  /* 设置段落文本颜色 */
  color: rgb(0, 0, 0);
  /* 过渡效果时长 */
  transition: 0.6s;
  /* 字体大小14像素 */
  font-size: 14px;
  /* 初始位置向下偏移600像素 */
  transform: translateY(600px);
  /* 设置背景颜色及透明度 */
  background-color: rgba(255, 255, 255, 0.7);
}

/* 鼠标悬停在 .box 上时的段落效果 */
.shell .box:hover .content p {
  transform: translateY(220px);
}
</style>
