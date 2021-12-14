import React from 'react'
import Dialog from 'react-native-dialog'

const ConfirmDialog = ({
  title,
  descreption,
  cancel,
  confirm,
  setValue,
  dialogVisible,
}) => {
  return (
    <Dialog.Container visible={dialogVisible}>
      <Dialog.Title> {title}</Dialog.Title>
      <Dialog.Description>{descreption}</Dialog.Description>
      <Dialog.Input onChangeText={setValue} />
      <Dialog.Button label="Restore" onPress={confirm} />
      <Dialog.Button label="Cancel" onPress={cancel} />
    </Dialog.Container>
  )
}

export default ConfirmDialog
