const electron = require('electron')
const {BrowserWindow, app} = electron.remote
const {ipcRenderer, ipcMain} = electron
const tooltipWindow = electron.remote.getCurrentWindow()
const elm = document.getElementById('electron-tooltip')
const inheritProperties = require('./props')


elm.addEventListener('transitionend', (e) => {

    if (e.target.style.opacity == 0) {

        elm.innerHTML = ''
        tooltipWindow.hide()
    }
})

// Inherits styling from the element as defined in the host window
ipcRenderer.on('set-styling', (e, props) => {

    inheritProperties.forEach(prop => {

        elm.style[prop] = props[prop]
    })
})

ipcRenderer.on('reset-content', e => {

    elm.style.transform = 'scale3d(.4,.4,1)'
    elm.style.opacity = 0;
    elm.removeAttribute('class')
})

ipcRenderer.on('set-content', (e, details) => {

    const {config, content, elmDimensions, originalWinBounds} = details

    // Set the input for the tooltip and resize the window to match the contents
    if (config.width) {

        elm.style.maxWidth = `${parseInt(config.width)}px`
        elm.style.whiteSpace = 'normal'

    } else {

        elm.style.maxWidth = 'none'
        elm.style.whiteSpace = 'nowrap'
    }

    elm.style.opacity = 1;
    elm.style.transform = 'scale3d(1, 1, 1)'
    elm.innerHTML = content

    // 12 = the margins on boths sides
    tooltipWindow.setContentSize(elm.clientWidth + 12, elm.clientHeight + 12)

    // Calculate the position of the element on the screen. Below consts return the topleft position of the element that should hold the tooltip
    var elmOffsetLeft = Math.round(originalWinBounds.x + elmDimensions.left)
    var elmOffsetTop = Math.round(originalWinBounds.y + elmDimensions.top)

    let positions = {

        top() {

            const top = elmOffsetTop - tooltipWindow.getContentSize()[1]
            return [this.horizontalCenter(), top]
        },

        bottom() {

            const top = elmOffsetTop + elmDimensions.height
            return [this.horizontalCenter(), top]
        },

        left() {

            const left = elmOffsetLeft - tooltipWindow.getContentSize()[0]
            return [left, this.verticalCenter()]
        },

        right() {

            const left = elmOffsetLeft + Math.round(elmDimensions.width)
            return [left, this.verticalCenter()]
        },

        horizontalCenter() {

            return elmOffsetLeft - (Math.round((tooltipWindow.getContentSize()[0] - elmDimensions.width) / 2))
        },

        verticalCenter() {

            return elmOffsetTop - (Math.round((tooltipWindow.getContentSize()[1] - elmDimensions.height) / 2))
        }

    }
    // Set the tooltip above the element with 5px extra offset
    // const top = config.position == 'bottom'
    //     ? elmOffsetTop + elmDimensions.height
    //     : elmOffsetTop - tooltipWindow.getContentSize()[1]
    // elm.classList.add(`position-${config.position}`)

    // const left = config.position == 'right'
    //     ? elmOffsetLeft + Math.round(elmDimensions.width)
    //     : elmOffsetLeft - (Math.round((tooltipWindow.getContentSize()[0] - elmDimensions.width) / 2)) //center

    // Position the tooltip
    elm.classList.add(`position-${config.position}`)
    const getPosition = positions[config.position]()
    tooltipWindow.setPosition(...getPosition)

    // Show it as inactive
    process.nextTick(() => {
        tooltipWindow.showInactive()
    })
})