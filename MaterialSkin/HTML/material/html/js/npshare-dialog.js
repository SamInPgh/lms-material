/**
 * LMS-Material
 *
 * Copyright (c) 2018-2026 Craig Drummond <craig.p.drummond@gmail.com>
 * MIT license.
 */
'use strict';

Vue.component('lms-npshare-dialog', {
    template: `
<v-dialog v-model="show" :width="cw+20" persistent v-if="show">
 <v-card>
  <v-card-title>{{i18n("Now Playing")}}</v-card-title>
  <v-list-tile-sub-title style="padding-left:16px;padding-right:16px">{{saveText}}</v-list-tile-sub-title>
  <div style="overflow:auto; margin-left:10px; margin-bottom:10px; margin-top:20px">
   <div :style="{'width':(cw+10)+'px', 'height': (ch+10)+'px'}">
    <img :src="src"></img>
   </div>
  </div>
  <v-card-actions>
   <v-spacer></v-spacer>
   <v-btn flat @click="download">{{i18n('Download')}}</v-btn>
   <v-btn flat @click="close">{{i18n('Close')}}</v-btn>
  </v-card-actions>
 </v-card>
</v-dialog>
`,
    props: [],
    data() {
        return {
            show: false,
            src: undefined,
            cw: 100,
            ch: 100,
            saveText: undefined
        }
    },
    computed: {
    },
    mounted() {
        bus.$on('npshare.open', function(canvas) {
            this.cw = canvas.width;
            this.ch = canvas.height;
            this.src = canvas.toDataURL('image/png');
            canvas.remove();
            this.saveText = IS_MOBILE
                ? i18n("Long-press on image and select 'Save image', then share anywhere. Or use the 'Download' button to download.")
                : i18n("Right-click on the image and select 'Copy image', then paste anywhere. Or use the 'Download' button to download.");
            this.show = true;
        }.bind(this));
        bus.$on('closeDialog', function(dlg) {
            if (dlg == 'npshare') {
                this.show=false;
            }
        }.bind(this));
    },
    methods: {
        close() {
            this.show = false;
        },
        download() {
            let a = document.createElement('a');
            let ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g,'-');
            a.download = 'now-playing-' + ts + '.png';
            a.href = this.src;
            a.click();
        },
        i18n(str) {
            if (this.show) {
                return i18n(str);
            } else {
                return str;
            }
        }
    },
    watch: {
        'show': function(val) {
            this.$store.commit('dialogOpen', {name:'npshare', shown:val});
        }
    }
})
