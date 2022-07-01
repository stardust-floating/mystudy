import HTTP from '../libs/http';
import { setPageData } from "../libs/utils";

class Service extends HTTP {
    getNewsList(type, count) {
        return new Promise((resolve, reject) => {
            this.ajax({
                url: 'Juh/getNewsList', // /api/toutiao/index
                type: 'POST',
                dataType: 'JSON',
                data: {
                    field: type
                },
                success: (data) => {
                    // console.log(data);
                    let pageData = data.result.data;
                    pageData = setPageData(pageData, count);
                    resolve(pageData);
                },
                error: () => {
                    reject(404);
                }
            })
        })
    }
}
export default new Service();