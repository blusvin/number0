   // PhoneGap加载完毕

//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, wgotFS, fail);

//获取newFile目录，如果不存在则创建该目录
function wgotFS(fileSystem) {
    newFile = fileSystem.root.getDirectory("smartblanket", {create : true,exclusive : false}, writerFile, fail);
}
//获取newFile目录下面的dataFile.txt文件，如果不存在则创建此文件
function writerFile(newFile) {
    newFile.getFile("dataFile.txt", {create : true,exclusive : false}, wgotFileEntry, fail);
}

function wgotFileEntry(fileEntry) {
    fileEntry.createWriter(wgotFileWriter, fail);
}

function wgotFileWriter(writer) {
    //onwrite：当写入成功完成后调用的回调函数
    writer.onwrite = function(evt) {
        console.log("writing success");
    };
    var macstring = bluesetstore.set1.devicemac + "||" + bluesetstore.set1.devicename + "||";
    macstring = macstring + bluesetstore.set2.devicemac + "||" + bluesetstore.set2.devicename + "||";
    macstring = macstring + bluesetstore.set3.devicemac + "||" + bluesetstore.set3.devicename + "||";
    writer.seek(0); //相当于文件光标
    writer.write(macstring); //参数为要写入文件的内容
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// PhoneGap加载完毕

//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, rgotFS, fail);   

//获取newFile目录，如果不存在则创建该目录
function rgotFS(fileSystem) {
    newFile = fileSystem.root.getDirectory("smartblanket", {create : true,exclusive : false}, readerFile, fail);
}
//获取newFile目录下面的dataFile.txt文件，如果不存在则创建此文件
function readerFile(newFile) {
    newFile.getFile("dataFile.txt", {create : true,exclusive : false}, rgotFileEntry, fail);
}

function rgotFileEntry(fileEntry) {
    fileEntry.file(rgotFile, fail);
}

function rgotFile(file){
    readAsText(file);
}

function readAsText(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as text");
        console.log(evt.target.result);
        var resultString = evt.target.result;
        var macpos = 0;
        while(resultString.length > 0) {
            var cellString = resultString.substring(0,resultString.indexOf("||"));
            var resultString = resultString.substring(resultString.indexOf("||") + 2, resultString.length);
            if(macpos == 0){
                bluesetstore.set1.devicemac = cellString;
            }else if(macpos == 1){
                bluesetstore.set1.devicename = cellString;
            }else if(macpos == 2){
                bluesetstore.set2.devicemac = cellString;
            }else if(macpos == 3){
                bluesetstore.set2.devicename = cellString;
            }else if(macpos == 4){
                bluesetstore.set3.devicemac = cellString;
            }else if(macpos == 5){
                bluesetstore.set3.devicename = cellString;
            }
            macpos += 1;
        }
    };
    reader.readAsText(file);
}
function fail(evt) {
    console.log(evt.target.error.code);
}
