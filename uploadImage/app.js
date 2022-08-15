const express = require('express');
const Busboy = require('busboy')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const app = express();

// 解决跨域问题
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

// 托管静态文件
app.use('/uploads',express.static(__dirname+'/uploads')) // 图片文件夹路径

app.post('/uploads',function(req,res){
    const bb = Busboy({ headers: req.headers });

    let data = {
        filename:'', // 图片名字
        encoding:'', // 图片大小
        mimeType:'', // 图片格式
        imgUrl:'' // 图片地址
    }

    bb.on('file', (name, file, info) => {
        // 名字 大小 格式
        const { filename, encoding, mimeType } = info;
        // 根据时间创建名字 - 防止重名
        const filePath = new Date().getTime() + path.extname(filename)
        // 保存数据
        data = {...info,filename:filePath}
        // 拼接地址
        const saveTo = path.join(__dirname, './uploads', filePath);
        // 写入流
        file.pipe(fs.createWriteStream(saveTo));
    }); 

    bb.on('finish', function () {
        // 地址回显
        data.imgUrl = 'http://127.0.0.1:3000/uploads/' + data.filename
        // 返回图片
        res.send({
            code:200,
            msg:'上传成功',
            data
        });
    });
    
    return req.pipe(bb);
});

// 开启服务器 监听3000端口
app.listen(3000,()=>{
    console.log('服务器启动中 地址：http://localhost:3000');
})