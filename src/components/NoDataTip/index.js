import tpl from './index.tpl';
import './index.scss';
import { tplReplace } from '../../libs/utils';

export default {
    name :'NoDataTip',
    tpl() {
        return tplReplace(tpl, {
            text: '没有数据'
        })
    }
}