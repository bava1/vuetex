<template>
  <div class="index">
    <p class="text-h5 text-bold index-clock">--#-&-$-#-[
      {{ localTime }}
      {{ new Date().toLocaleString('cs', { weekday: 'long'}) }}
      {{ new Date().toLocaleDateString('cs') }} ]-#-&-$-#--
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const localTime = ref('');

const showLocaleTime = () => {
    setInterval(() => localTime.value = new Date().toLocaleTimeString(), 1000);
};

onMounted(() => {
  showLocaleTime();
});
</script>

<style lang="scss" scoped>
.index {
  position: fixed;
    width: 100%;
    height: 950px;
    margin-top: -80px;
    background-image: url("../assets/img/Vueton-12.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    text-align: center;

    &-clock {
      color: rgb(204, 255, 221);
      letter-spacing: .4rem;
      opacity: .7;
      padding: 100px 0 0;
      text-shadow: 2px 2px 2px rgb(66, 193, 178);
    }

    &-clock:hover {
      transform: scale(1.1);
    }
}

/* RESPONSIVE */
@media screen and (max-width: 1024px) {

  .index {
    background-image: url("../assets/img/Vueton-13.png");
  }
  .index-clock {
    padding: 80px 0 0;
    font-size: 16px;
  }

}
</style>

