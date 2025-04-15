<template>
    <div class="panel">
        <h3>Выбор маркеров</h3>
        <form action="" class="toggels">
            <div>
                <label for="all" class="radio-wrapper">Все
                    <input type="radio" name="viewMarker" id="all" class="radio-toggel">
                    <span class="custom-radio"></span>
                </label>
            </div>
            <div>
                <label for="playground" class="radio-wrapper">Площадки 
                    <input type="radio" name="viewMarker" id="playground" class="radio-toggel">
                    <span class="custom-radio"></span>
                </label>
            </div>
            <div>
                <label for="market" class="radio-wrapper">Зоомагазины
                    <input type="radio" name="viewMarker" id="market" class="radio-toggel">
                    <span class="custom-radio"></span>
                </label>
            </div>
            <div>
                <label for="hospital" class="radio-wrapper">Вет. клиники
                    <input type="radio" name="viewMarker" id="hospital" class="radio-toggel">
                    <span class="custom-radio"></span>
                </label>
            </div>
        </form>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.panel{
    background: #5f5f5f;
}

.toggels{
    display: flex;
    padding: 1rem;
    justify-content: space-around;
}

.radio-wrapper input[type="radio"] {
  opacity: 0;
  cursor: pointer;
}

.custom-radio {
  height: 20px;
  width: 50px;
  background-color: #eee;
  border: 2px solid #999;
  border-radius: 50%;
  transition: 0.2s;
}

.radio-wrapper input:checked ~ .custom-radio {
  border-color: #71d316;
  background-color: #fff;
}

.custom-radio::after {
  content: "";
  display: none;
}

.radio-wrapper input:checked ~ .custom-radio::after {
  display: block;
}

.radio-wrapper .custom-radio::after {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #71d316;
}

</style>