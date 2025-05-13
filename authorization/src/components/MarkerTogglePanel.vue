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
    background-color: #5f5f5f;
    display: flex; 
    flex-direction: column;
    padding-bottom: 1rem;
    margin-top: 1rem;
    border-radius: 1rem;
}

.panel h3{
    margin: 1rem;
}

.toggels{
    display: flex;
    justify-content: space-around;
    padding: 1rem;
}

.radio-wrapper{
    display: flex;
}

</style>