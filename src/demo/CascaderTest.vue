<template>
  <div>
      <fieldset>
          <legend>Cascader组件测试</legend>
          <Region v-model="region" :labelInValue="true"/>
          <Vehicle v-model="vehicles" :attrs="vehicleAttrs" />
          <Vehicle v-model="vehicle" />
      </fieldset>
  </div>
</template>

<script>
import Region from '../components/Region';
import Vehicle from '../components/VehicleBrandAndSerial';

export default {
    components: {
        Region,
        Vehicle,
    },
    data() {
        return {
            region: '420381',
            vehicles: ['2013款 Cabriolet 40 TFSI风尚版', '2015款 2.4L 豪华商务尊享版'],
            vehicle: '2015款 18T 双离合运动旗舰型',
            vehicleAttrs: {
                props: {
                    multiple: true,
                },
            },
        };
    },
    watch: {
        region(val) {
            console.log(val);
        },
        vehicle(val) {
            console.log(val);
        },
        vehicles(val) {
            console.log(val);
        },
    },
};
</script>
