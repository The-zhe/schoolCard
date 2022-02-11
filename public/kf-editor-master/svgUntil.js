const covertSVG2Image = (node, name, width, height, type = 'png') => {
    let serializer = new XMLSerializer()
    let source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(node)
    let image = new Image()
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)
    // console.log(image)
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    let context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, 10000, 10000)
    image.onload = function () {
        context.drawImage(image, 0, 0)
        let a = document.createElement('a')
        a.download = `${name}.${type}`
        a.href = canvas.toDataURL(`image/${type}`)
        // console.log(a.href.substring(a.href.indexOf(",") + 1))
        window.parent.postMessage(a.href.substring(a.href.indexOf(",") + 1),'*');
        // parent.getFun(a.href.substring(a.href.indexOf(",") + 1));
        }
}