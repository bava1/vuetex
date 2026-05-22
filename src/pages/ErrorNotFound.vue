<template>
  <div class="no-found text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="no-found_title">
        404
      </div>
      <div class="no-found_text text-h4">
        Oops. Nothing here...
      </div>
      <q-btn
        class="q-mt-xl"
        color="green-10"
        text-color="white"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.no-found {
  position: fixed;
  display: flex;
  width: 100%;
  height: 950px;
  margin-top: -85px;
  padding-bottom: 30px;
  background-image: url("../assets/img/Tasks-3.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  text-align: center;
  background-color:  rgb(1, 16, 5);

  &_title {
    font-size: 20vh;
    color: rgb(88, 228, 137);
    opacity:.4;
  }

  &_text {
    opacity:.4;
    color: rgb(88, 228, 137);
  }
}

</style>

