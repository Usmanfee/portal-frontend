/********************************************************************************
 * Copyright (c) 2021,2022 BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { Box } from '@mui/material'
import { FunctionComponent } from 'react'
import { DropZonePreviewTranslations, UploadFile } from '../types'
import {
  DropPreviewFile as DefaultDropPreviewFile,
  DropPreviewFileProps,
} from './DropPreviewFile'

export interface DropPreviewProps {
  uploadFiles: UploadFile[]
  onDelete?: (deleteIndex: number) => void
  translations: DropZonePreviewTranslations

  DropStatusHeader?: FunctionComponent<DropStatusHeaderProps> | false
  DropPreviewFile?: FunctionComponent<DropPreviewFileProps> | false
}

export interface DropStatusHeaderProps {
  numUploaded: number
  numTotal: number
}

export const DropPreview: FunctionComponent<DropPreviewProps> = ({
  uploadFiles,
  translations,
  onDelete,
  DropStatusHeader,
  DropPreviewFile,
}) => {
  const isFinished = (file: UploadFile) =>
    file.status === 'upload_success' || file.status === 'upload_error'

  const filesCount = uploadFiles.length

  const finishedFilesCount = uploadFiles.filter(isFinished).length

  const DefaultDropStatusHeader: typeof DropStatusHeader = ({
    numUploaded,
    numTotal,
  }) => {
    const uploadProgress = translations.uploadProgess
      .replace('%', numUploaded.toString())
      .replace('%', numTotal.toString())

    return (
      <Box sx={{ typography: 'label2' }}>
        {filesCount ? uploadProgress : translations.placeholder}
      </Box>
    )
  }

  let DropStatusHeaderComponent = DefaultDropStatusHeader
  if (DropStatusHeader) {
    DropStatusHeaderComponent = DropStatusHeader
  } else if (DropStatusHeader === false) {
    DropStatusHeaderComponent = () => null
  }

  let DropPreviewFileComponent = DefaultDropPreviewFile
  if (DropPreviewFile) {
    DropPreviewFileComponent = DropPreviewFile
  } else if (DropPreviewFile === false) {
    DropPreviewFileComponent = () => null
  }

  return (
    <Box sx={{ marginTop: 4 }}>
      <DropStatusHeaderComponent
        numUploaded={finishedFilesCount}
        numTotal={filesCount}
      />
      {finishedFilesCount > 0 && (
        <Box sx={{ marginTop: 4 }}>
          {uploadFiles.map(
            (file, index) =>
              isFinished(file) && (
                <DropPreviewFileComponent
                  key={index}
                  uploadFile={file}
                  translations={translations}
                  onDelete={() => onDelete?.(index)}
                />
              )
          )}
        </Box>
      )}
      {filesCount - finishedFilesCount > 0 && (
        <Box sx={{ marginTop: 4 }}>
          {uploadFiles.map(
            (file, index) =>
              !isFinished(file) && (
                <DropPreviewFileComponent
                  key={index}
                  uploadFile={file}
                  translations={translations}
                  onDelete={() => onDelete?.(index)}
                />
              )
          )}
        </Box>
      )}
    </Box>
  )
}
