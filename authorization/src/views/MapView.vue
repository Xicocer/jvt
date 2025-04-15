<script setup>
    import {ref, onMounted, computed} from 'vue'
    import { useAuthStore } from '@/stores/auth';
    import axios from 'axios';
    import {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} from '@/lib/ymaps';

    import ToggelComponent from '@/components/ToggelComponent.vue';
    import MarkerTogglePanel from '@/components/MarkerTogglePanel.vue';

    const LOCATION = {
        center: [37.588144, 55.733842],
        zoom:9
    };
</script>

<template>
    <div class="container">
        <div class="map-container">
            <div class="map">
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
            <div>
                <MarkerTogglePanel/>
            </div>
        </div>
        <div class="toggle-view">
            <ToggelComponent/>
        </div>
    </div>
    
</template>

<style lang="scss" scoped>
.container{
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
}
.map{
    border: 2px solid #16d384;
    width: 35vw;
    height: 60vh;
}

.map-view{
    border-radius: 1rem;
}
</style>