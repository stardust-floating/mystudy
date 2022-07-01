import tpl from './index.tpl';
import './index.scss'
import { tplReplace } from '../../libs/utils';

export default {
    name: 'ErrorTip',
    tpl({text}) {
        return tplReplace(tpl, {
            text
        })
    }
}