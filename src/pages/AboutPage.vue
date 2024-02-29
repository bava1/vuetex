<template>
  <div class="about">
    <div class="about-center">
      <div class="about-text text-h6 q-pb-lg">Creator</div>
      <q-img class="about-center_logo q-mb-sm" src="~assets/img/LogoProfil.jpg"/>
      <div class="about-text text-h6 q-pt-lg">Technologies used:</div>
      <q-img class="about-center_tech q-mt-xs" src="~assets/img/logos.png"/>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.about {
  position: fixed;
  width: 100%;
  height: 950px;
  margin-top: -85px;
  background-image: url("../assets/img/About-2.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  text-align: center;
  opacity: .8;

  &-center {
    padding-top: 270px;

    &_logo {
      width: 70px;
      border-radius: 50%;
      filter: drop-shadow(1px 1px 12px #86ca7d);
    }

    &_logo:hover {
      transform: scale(1.2);
      filter: blur(1px);
    }

    &_tech {
      width: 300px;
      filter: drop-shadow(1px 1px 12px #86ca7d);
    }

    &_tech:hover {
      transform: scale(1.1);
      filter: blur(1px);
    }
  }

  &-text {
    color: #2add7e;
    text-shadow: 2px 2px 2px rgb(66, 193, 178);
    letter-spacing: .2rem;
  }
}
.my-card {
  width: 100%;
  max-width: 350px;
}

/* RESPONSIVE */
@media screen and (max-width: 1024px) {
  .index-clock {
    font-size: 16px;
  }

}
</style>
