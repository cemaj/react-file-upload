import React, { useState, ChangeEvent, DragEvent, RefObject } from 'react'
import styled from 'styled-components'

import { Colors } from '../../lib/style-guide'
import { randomClassName } from '../../lib/rcn'

const rcn = randomClassName()
const dashArray = Math.PI * 79
const STORAGE_SIGNED_URL =
  'http://storage-upload.googleapis.com/upload-file-test/1570043487646.JPEG'

interface UploadFileProps {
  value?: string
  onChange?(url: string): void
  className?: string
}

const Circle: React.FunctionComponent<{
  state: string
  dashOffset: number
}> = (props) => {
  return (
    <circle
      className="circle-status"
      cx="40"
      cy="40"
      r={39.5}
      strokeWidth="1px"
      transform={'rotate(-90 40 40)'}
      style={{
        strokeDasharray: dashArray,
        strokeDashoffset: props.dashOffset,
        stroke: props.state === 'pending' ? Colors.BORDER1 : Colors.BG1
      }}
    />
  )
}

/**
 * Simple component for upload file
 *
 * @param {string} value
 * @param {Function} onChange
 * @param {string} className
 */

const UploadFile: React.FunctionComponent<UploadFileProps> = (props) => {
  const [dashOffset, setDashOffset] = useState(0)
  const [highlight, setHighlight] = useState(false)
  const [fileLink, setFileLink] = useState('')
  const [request, setRequest] = useState(new XMLHttpRequest())
  const [uploading, setUploading] = useState({ state: 'init', percent: 0 })

  const fileInputRef: RefObject<HTMLInputElement> = React.createRef<
    HTMLInputElement
  >()

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault()
    setHighlight(true)
  }

  const onDrop = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault()

    const file = evt.dataTransfer.files[0]
    if (file == null) {
      alert("Can't find file")
      return
    }

    validateImage(file)
      .then((url) => {
        setFileLink(url)
        onUploadFile(file)
      })
      .catch((err) => {
        alert(err)
      })
    setHighlight(false)
  }

  const onDragLeave = () => {
    setHighlight(false)
  }

  const onFileDialog = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  const onSelected = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target === null || evt.target.files === null) {
      alert("Can't send file")
      return
    }

    const file = evt.target.files[0]
    if (file == null) {
      alert("Can't find file")
      return
    }

    validateImage(file)
      .then((url) => {
        setFileLink(url)
        onUploadFile(file)
      })
      .catch((err) => {
        alert(err)
      })
  }

  const validateImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.src = url
      img.onload = function() {
        if (img.width != 100 && img.height != 100) {
          reject('Logo should be square, 100px size')
        } else {
          resolve(url)
        }
      }
    })
  }

  const onUploadFile = (file: File) => {
    return new Promise((resolve, reject) => {
      request.upload.addEventListener(
        'progress',
        (evt: ProgressEvent<XMLHttpRequestEventTarget>) => {
          if (evt.lengthComputable) {
            const percent = (evt.loaded / evt.total) * 100
            const dashOffset = dashArray - (dashArray * percent) / 100
            setUploading({ state: 'pending', percent: percent })
            setDashOffset(dashOffset)
          }
        }
      )

      request.upload.addEventListener('load', () => {
        setUploading({ state: 'uploaded', percent: 100 })
        if (props.onChange) props.onChange(props.value ? props.value : '')
        resolve(request.response)
      })

      request.upload.addEventListener('loadend', () => {
        setRequest(new XMLHttpRequest())
      })

      request.upload.addEventListener('error', () => {
        reject(request.response)
        setUploading({ state: 'init', percent: 0 })
      })

      const formData = new FormData()
      formData.append('file', file, file.name)

      request.open('POST', STORAGE_SIGNED_URL)
      request.send(formData)
    })
  }

  const cancelUpload = () => {
    request.abort()
    setUploading({ state: 'init', percent: 0 })
  }

  return (
    <div className={props.className}>
      <div className={'upload-header'}>
        <div className={'header-title header-text'}>Company Logo</div>
        <div className={'header-description header-text'}>
          Logo should be square, 100px size and in png, jpeg file format.
        </div>
      </div>
      <div className={'upload-content'}>
        <div
          className={`content-dropzone ${highlight ? 'content-highlight' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            className="content-fileinput"
            type="file"
            onChange={onSelected}
            accept={'.jpg, .jpeg, .png'}
          />
          <svg
            className={'content-icon'}
            width="80"
            height="80"
            viewBox={'0 0 80 80'}
          >
            <circle
              className={'circle-background'}
              cx="40"
              cy="40"
              r={39.5}
              strokeWidth="1px"
            />
            <Circle state={uploading.state} dashOffset={dashOffset} />
            {uploading.state === 'uploaded' ? (
              <image
                className={'content-logo'}
                href={props.value ? props.value : fileLink}
                height="80"
                width="80"
              />
            ) : (
              <svg
                className={'content-icon-alt'}
                width="29.63"
                height="45.93"
                viewBox="0 0 32 48"
                x="24.69"
                y="18.23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M28.072 1.87489C29.3858 1.3494 30.8148 2.31692 30.8148 3.73184V46.7037H1.18518V13.9837C1.18518 13.1659 1.68308 12.4305 2.4424 12.1267L28.072 1.87489Z"
                  stroke="#D1E3F8"
                />
                <rect
                  x="7.11108"
                  y="17.0745"
                  width="7.40741"
                  height="8.88889"
                  fill="#D1E3F8"
                />
                <rect
                  x="17.4815"
                  y="17.0745"
                  width="7.40741"
                  height="2.96296"
                  fill="#D1E3F8"
                />
                <rect
                  x="17.4815"
                  y="11.1486"
                  width="7.40741"
                  height="2.96296"
                  fill="#D1E3F8"
                />
                <path
                  d="M7.11108 29.9264C7.11108 29.3741 7.5588 28.9264 8.11108 28.9264H23.8889C24.4411 28.9264 24.8889 29.3741 24.8889 29.9264V46.7041H7.11108V29.9264Z"
                  fill="#D1E3F8"
                />
                <rect
                  x="17.4815"
                  y="23.0004"
                  width="7.40741"
                  height="2.96296"
                  fill="#D1E3F8"
                />
              </svg>
            )}
          </svg>
          <div className={`${rcn('here')} content-text`}>
            {uploading.state === 'init' && <span>Drag & drop here</span>}
            {uploading.state === 'pending' && <span>Uploading</span>}
            {uploading.state === 'uploaded' && (
              <span>Drag & drop here to replace</span>
            )}
          </div>
          <div className={`${rcn('or')} content-text`}>- or -</div>
          <div
            className={`${rcn('select')} content-text`}
            onClick={
              uploading.state === 'pending' ? cancelUpload : onFileDialog
            }
            style={{ cursor: 'pointer' }}
          >
            {uploading.state === 'init' && <span>Select file to upload</span>}
            {uploading.state === 'pending' && <span>Cancel</span>}
            {uploading.state === 'uploaded' && (
              <span>Select file to replace</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const StyledUploadFile = styled(UploadFile)`
  width: 400px;
  height: 590px;
  margin: 0 auto;
  align-self: center;

  background: ${Colors.PureWhite};
  border: 1px solid ${Colors.BG2};
  box-sizing: border-boxu;

  .upload-header {
    height: 79px;
    border-bottom: 1px solid ${Colors.BG2};
  }

  .header-text {
    position: relative;
    width: 347px;
    height: 20px;
    margin: 0 auto;
    font-style: normal;
  }

  .header-title {
    top: 21px;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    color: ${Colors.TX1};
  }

  .header-description {
    top: 20px;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
    display: flex;
    align-items: center;
    color: ${Colors.TX3};
  }

  .upload-content {
    width: 360px;
    height: 470px;
    margin: 19px auto;
  }

  .content-dropzone {
    height: 100%;
    width: 100%;
    background-color: ${Colors.PureWhite};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
  }

  .content-highlight {
    background-color: ${Colors.BG3};
    border: 1px dashed ${Colors.BORDER1};
  }

  .content-icon {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    background-color: ${Colors.PureWhite};
  }

  .content-icon-alt {
    align-self: center;
  }

  .content-fileinput {
    display: none;
  }

  .content-text {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
  }

  .circle-background,
  .circle-status {
    fill: none;
  }

  .circle-background {
    stroke: ${Colors.BG1};
  }

  .${rcn('here')} {
    padding-top: 9px;
    /* TX 2 */
    color: ${Colors.TX2};
  }

  .${rcn('or')} {
    padding-top: 8px;
    /* TX 3 */
    color: ${Colors.TX3};
  }

  .${rcn('select')} {
    padding-top: 4px;
    /* Accord Blue */
    color: ${Colors.BORDER1};
  }

  .upload-err {
    color: red;
    font-size: 12px;
    margin-top: 10px;
  }
`

export { StyledUploadFile as UploadFile }
