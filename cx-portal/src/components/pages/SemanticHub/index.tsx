/* eslint-disable react-hooks/exhaustive-deps */
import StageHeader from 'components/shared/frame/StageHeader'
import { Button, PageSnackbar, Typography } from 'cx-portal-shared-components'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import ModelDetailDialog from './ModelDetailDialog'
import ModelTable from './ModelTable'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchModelArtefact,
  fetchSemanticModelById,
} from 'features/semanticModels/actions'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ModelImportDialog from './ModeImportDialog'
import { semanticModelsSelector } from 'features/semanticModels/slice'

export default function SemanticHub() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showModel, setShowModel] = useState<boolean>(false)
  const [importModel, setImportModel] = useState<boolean>(false)
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false)
  const [errorAlertMsg, setErrorAlertMsg] = useState<string>('')
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false)
  const [successAlertMsg, setSuccessAlertMsg] = useState<string>('')
  const { deleteError, deleteModelId, uploadedModel, uploadError } =
    useSelector(semanticModelsSelector)

  useEffect(() => {
    if (deleteError.length > 0) {
      setErrorAlertMsg(deleteError)
      setShowErrorAlert(true)
    }
  }, [deleteError])

  useEffect(() => {
    if (uploadError.length > 0) {
      setErrorAlertMsg(uploadError)
      setShowErrorAlert(true)
    }
  }, [uploadError])

  useEffect(() => {
    if (deleteModelId.length > 0) {
      setShowModel(false)
      setSuccessAlertMsg(t('content.semantichub.alerts.deleteSuccess'))
      setShowSuccessAlert(true)
    }
  }, [deleteModelId])

  useEffect(() => {
    if (uploadedModel !== null) {
      setShowModel(false)
      setSuccessAlertMsg(t('content.semantichub.alerts.uploadSuccess'))
      setShowSuccessAlert(true)
    }
  }, [uploadedModel])

  const onErrorAlertClose = () => {
    setShowErrorAlert(false)
    setErrorAlertMsg('')
  }

  const onSuccessAlertClose = () => {
    setShowSuccessAlert(false)
    setSuccessAlertMsg('')
  }

  const onModelSelect = (urn: string) => {
    setShowModel(true)
    const encodedUrn = encodeURIComponent(urn)
    dispatch(fetchSemanticModelById(encodedUrn))
    dispatch(fetchModelArtefact({ type: 'diagram', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'ttl', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'json', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'payload', id: encodedUrn }))
    dispatch(fetchModelArtefact({ type: 'docu', id: encodedUrn }))
  }

  return (
    <>
      <StageHeader title={t('content.semantichub.title')} />
      <main className="semantic-models">
        <section>
          <Grid container justifyContent="space-between">
            <Grid item xs={5}>
              <Typography variant="body2" mb={2}>
                {t('content.semantichub.introText_0')}
              </Typography>
              <Typography variant="body2" mb={4}>
                {t('content.semantichub.introText_1')}
              </Typography>
              <Button
                onClick={() => setImportModel(true)}
                startIcon={<AddCircleOutlineIcon fontSize="large" />}
              >
                {t('content.semantichub.addModel')}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <img
                style={{ marginTop: '-200px', border: '16px solid white' }}
                src="/edc-connector-text-image.png"
                width="100%"
                alt={'alt tag info'}
              />
            </Grid>
          </Grid>
        </section>
        <ModelTable onModelSelect={onModelSelect} />
      </main>
      <ModelDetailDialog show={showModel} onClose={() => setShowModel(false)} />
      <ModelImportDialog
        show={importModel}
        onClose={() => setImportModel(false)}
      />
      <PageSnackbar
        open={showErrorAlert}
        onCloseNotification={onErrorAlertClose}
        severity="error"
        title={t('content.semantichub.alerts.alertErrorTitle')}
        description={errorAlertMsg}
        showIcon={true}
        vertical={'bottom'}
        horizontal={'left'}
      />
      <PageSnackbar
        open={showSuccessAlert}
        onCloseNotification={onSuccessAlertClose}
        severity="success"
        title={t('content.semantichub.alerts.alertSuccessTitle')}
        description={successAlertMsg}
        showIcon={true}
        vertical={'bottom'}
        horizontal={'left'}
      />
    </>
  )
}
