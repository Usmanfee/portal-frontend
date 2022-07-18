import './InviteFormContent.scss'
import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Input } from 'cx-portal-shared-components'
import debounce from 'lodash.debounce'
import { InviteData } from 'features/admin/registration/types'
import Patterns from 'types/Patterns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AddInviteFormOverlayProps {
  openDialog?: boolean
  handleOverlayClose: React.MouseEventHandler
  onSubmit: (data: InviteData) => void
  state: string
}

export const InviteFormContent = ({
  openDialog = false,
  handleOverlayClose,
  onSubmit,
  state
}: AddInviteFormOverlayProps) => {
  const { t } = useTranslation()
  const [inpExpr, setInpExpr] = useState<string[]>(['', '', '', ''])
  const [inpValid, setInpValid] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    true,
  ])

  useEffect(() => {
    if (openDialog) {
      setInpExpr(['', '', '', ''])
      setInpValid([false, false, false, false, true])
    }
  }, [openDialog])
  
  const debouncedValidation = useMemo(
    () =>
      debounce((expr: string[]) => {
        const check = [
          /^.{2,60}$/i,
          Patterns.MAIL,
          Patterns.NAME,
          Patterns.NAME,
        ].map((p, i) => !p.test(expr[i]))
        check.push(check.reduce((all, valid) => all || valid))
        setInpValid(check)
      }, 300),
    [setInpValid]
  )

  const doValidate = useCallback(
    (index: number, value: string) => {
      const data = inpExpr
      data[index] = value
      setInpExpr(data.slice())
      debouncedValidation(data)
    },
    [debouncedValidation, inpExpr]
  )

  const doSubmit = () =>
    onSubmit({
      userName: inpExpr[1].trim(),
      firstName: inpExpr[2].trim(),
      lastName: inpExpr[3].trim(),
      email: inpExpr[1].trim(),
      organisationName: inpExpr[0].trim(),
    })

  return (
    <>
      <Dialog
        open={openDialog}
        sx={{ '.MuiDialog-paper': { maxWidth: '65%' } }}
      >
        <DialogHeader
          title={t('content.invite.headerTitle')}
          intro={t('content.invite.headerIntro')}
        />
        <DialogContent sx={{ padding: '0px 130px 40px 150px' }}>
          <form className="InviteForm">
            {['company', 'email', 'first', 'last'].map((value, i) => (
              <Input
                label={t(`global.field.${value}`)}
                key={i}
                name={value}
                placeholder={t(`global.field.${value}`)}
                value={inpExpr[i]}
                error={inpValid[i]}
                autoFocus={value === 'company'}
                onChange={(e) => doValidate(i, e.target.value)}
              ></Input>
            ))}
          </form>
          <span className={`InviteFormResult ${state}`}>
            {state === 'busy' && <span className="loader" />}
          </span>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={(e) => handleOverlayClose(e)}>
            {`${t('global.actions.cancel')}`}
          </Button>
          <Button
            name="send"
            disabled={inpValid[4]}
            onClick={doSubmit}
          >{`${t('content.invite.invite')}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
