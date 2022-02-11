// 根据文件名后缀区分 文件类型
/*
 * @param: fileName - 文件名称
 * @param: 数据返回 1) 无后缀匹配 - false
 * @param: 数据返回 2) 匹配图片 - image
 * @param: 数据返回 3) 匹配 txt - txt
 * @param: 数据返回 4) 匹配 excel - excel
 * @param: 数据返回 5) 匹配 word - word
 * @param: 数据返回 6) 匹配 pdf - pdf
 * @param: 数据返回 7) 匹配 ppt - ppt
 * @param: 数据返回 8) 匹配 视频 - video
 * @param: 数据返回 9) 匹配 音频 - radio
 * @param: 数据返回 10) 其他匹配项 - other
 */
import {Message} from 'element-ui';

const fileType = {
    matchType(fileName) {
        // 后缀获取
        var suffix = ''
        // 获取类型结果
        var result = ''
        try {
            var flieArr = fileName.split('.');
            suffix = flieArr[flieArr.length - 1];
        } catch (err) {
            suffix = '';
        }
        // fileName无后缀返回 false
        if (!suffix) {
            result = false;
            return result;
        }
        // 图片格式
        var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
        // 进行图片匹配
        result = imglist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = {
                type: 'image',
                fooderType: '6'
            };
            return result;
        }
        ;
        // 匹配txt
        var txtlist = ['txt'];
        result = txtlist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = 'txt';
            return result;
        }
        ;
        // 匹配 excel
        var excelist = ['xls', 'xlsx'];
        result = excelist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = {
                type: 'excel',
                fooderType: '2'
            };
            return result;
        }
        ;
        // 匹配 word
        var wordlist = ['doc', 'docx'];
        result = wordlist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = {
                type: 'word',
                fooderType: '1'
            };
            return result;
        }
        ;
        // 匹配 pdf
        var pdflist = ['pdf'];
        result = pdflist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = {
                type: 'pdf',
                fooderType: '7'
            };
            return result;
        }
        ;
        // 匹配 ppt
        var pptlist = ['ppt', 'pptx'];
        result = pptlist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = {
                type: 'ppt',
                fooderType: '3'
            };
            return result;
        }
        ;
        // 匹配 视频
        var videolist = ['mp4', 'm2v', 'mkv'];
        result = videolist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = {
                type: 'video',
                fooderType: '4'
            };
            return result;
        }
        ;
        // 匹配 音频
        var radiolist = ['mp3', 'wav', 'wmv'];
        result = radiolist.some(function (item) {
            return item == suffix;
        });
        if (result) {
            result = {
                type: 'radio',
                fooderType: '5'
            };
            return result;
        }
        // 其他 文件类型
        result = 'other';
        Message.error('素材不支持该类型的文件');
        throw new Error('素材不支持该类型的文件')
        return result
    }
}
export default fileType;
      