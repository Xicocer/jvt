<script setup>
    import {ref, onMounted, computed} from 'vue'
    import axios from 'axios';
    import {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} from '@/lib/ymaps';

    const LOCATION = {
        center: [37.588144, 55.733842],
        zoom:9
    };
</script>

<template>
    <div class="container">
        <div class="map-container">
            <div class="map border-b-lg border-primary border-opacity-100">
                <YMap :location="LOCATION" >
                    <YMapDefaultSchemeLayer/>
                    <YMapDefaultFeaturesLayer/>
                    <YMapMarker :coordinates="[37.588144, 55.733842]" :draggable="true">
                        <section>
                            <h1 class="second-color">You can drag this header</h1>
                        </section>
                    </YMapMarker>
                </YMap>
            </div>
        </div>
    </div>
    
</template>

<style lang="scss" scoped>
.container{
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 100%;
}
.map{
    width: 100vw;
    height: 60vh;
}

.map-view{
    border-radius: 1rem;
}
</style>