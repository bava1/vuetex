<template>
  <div class="articles">
    <div class="articles-title text-h5 q-my-xs">Vue features</div>
    <div class="articles-blocks">
      <div class="articles-blocks_left">
        <q-list bordered>
          <expansionItem :itemsList="featuresList[0]"></expansionItem>
        </q-list>
      </div>

      <div class="articles-blocks_center">
        <q-list bordered>
          <expansionItem :itemsList="featuresList[1]"></expansionItem>
        </q-list>
      </div>

      <div class="articles-blocks_right">
        <q-list bordered>
          <expansionItem :itemsList="featuresList[2]"></expansionItem>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { featuresList } from 'src/stores/featuresList.js'
import expansionItem from 'src/components/Items/expansionItem.vue'
</script>

<style lang="scss" scoped>
.articles {
  width: 100%;
  height: 1024px;
  margin-top: -85px;
  background-image: url("../assets/img/Cont-2.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  text-align: center;

  &-title {
    padding-top: 177px;
    color: #2add7e;
    font-weight: 800;
    letter-spacing: .2rem;
    text-shadow: 2px 2px 2px rgb(66, 193, 178);
  }

  &-blocks {
    display: flex;
    justify-content: center;
    padding-top: 10px;

    &_left {
      width: 260px;
      padding-top: 180px;
      opacity: .9;
    }

    &_center {
      width: 330px;
      opacity: .9;
    }

    &_right {
      width: 260px;
      padding-top: 180px;
      opacity: .9;
    }
  }
}

/* RESPONSIVE */
@media screen and (max-width: 1024px) {
  .articles {
    background-image: url("../assets/img/Cont-3.png");
  }

  .articles-blocks {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    width: 100%;

    &_left {
      width: 410px;
      padding-top: 0px;
    }

    &_center {
      width: 410px;
    }

    &_right {
      width: 410px;
      padding-top: 0px;
    }
  }

}

@media screen and (max-width: 570px) {
  .articles-blocks {
    &_left {
      width: 310px;
    }

    &_center {
      width: 310px;
    }

    &_right {
      width: 310px;
    }
  }

}
</style>
