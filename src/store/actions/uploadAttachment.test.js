/* eslint-env jest */

describe('uploadAttachmentUsingPicker', () => {
  const url = 'http://filepicker.io/hfwoe/eh98e'
  const filename = 'foo.jpg'
  const opts = { type: 'userAvatar', id: 3, attachmentType: 'image' }
  
  it('returns an API action after filepicker succeeds', () => {
    const uploadAttachmentUsingPicker = setupUploadAttachment(true, { url, filename })
    const action = uploadAttachmentUsingPicker(opts)
  
    expect(action).toEqual({
      type: 'UPLOAD_ATTACHMENT',
      payload: expect.any(Promise),
      meta: opts
    })
  
    return expect(action.payload).resolves.toEqual({
      api: {
        method: 'post',
        path: '/noo/upload',
        params: { url, id: 3, type: 'userAvatar', filename }
      }
    })
  })
  
  it('rejects when picker fails', () => {
    const uploadAttachmentUsingPicker = setupUploadAttachment(false, new Error('nope'))
    return expect(uploadAttachmentUsingPicker(opts).payload).rejects.toEqual(new Error('nope'))
  })
})

function setupUploadAttachment (shouldSucceed, callbackArgs) {
  jest.resetModules()

  jest.doMock('client/filepicker', () => {
    if (shouldSucceed) {
      return { uploadFile: opts => opts.success(callbackArgs), ACCEPTED_MIME_TYPES: {} }
    } else {
      return { uploadFile: opts => opts.failure(callbackArgs), ACCEPTED_MIME_TYPES: {} }
    }
  })

  const uploadAttachment = require('./uploadAttachment')
  
  return uploadAttachment.uploadAttachmentUsingPicker
}