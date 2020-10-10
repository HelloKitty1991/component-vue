<template>
    <div class="demo">
      <fieldset>
        <legend>缺省页测试</legend>
        <DefaultPage
            text="还未添加常用功能，"
            icon="no-data__order"
        />
      </fieldset>
        <MixinTest />
        <SearchbarTest />
        <CascaderTest />
        <!-- <TageditTest /> -->
        <!-- <fieldset>
            <legend>PageFooter测试</legend>
            <PageFooter />
        </fieldset> -->
    </div>
</template>
<script>
import MixinTest from './MixinTest';
import SearchbarTest from './SearchbarTest';
import CascaderTest from './CascaderTest';
// import TageditTest from './TageditTest';
// import PageFooter from '../components/PageFooter';
import DefaultPage from '../components/EmptyPage';

export default {
    components: {
        // PageFooter,
        // TageditTest,
        MixinTest,
        SearchbarTest,
        CascaderTest,
        DefaultPage,
    },
    data() {
        return {
        };
    },
    methods: {
    },
};
</script>

<style lang="scss" scoped>
    .demo {
        min-width: 1500px;
    }
</style>
