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

import { ComponentStory } from '@storybook/react'

import { DropPreview as Component } from './components/DropPreview'

export default {
  title: 'Dropzone',
  component: Component,
  args: {
    uploadFiles: [
      { fileName: 'Test123.pdf', fileSize: 44345000, status: 'new' },
      {
        fileName: 'Document.pdf',
        fileSize: 65402,
        status: 'uploading',
        progressPercent: 45,
      },
      {
        fileName:
          'Das ist ein sehr langer Name von einer Datei - der Name ist wirklich äußerst, äußerst lang...!.pdf',
        fileSize: 32003,
        status: 'new',
      },
      {
        fileName: 'My pretty PDF.pdf',
        fileSize: 54676543,
        status: 'upload_success',
      },
      {
        fileName: 'Nix wars.xls',
        fileSize: 543545,
        status: 'upload_error',
      },
    ],
    translations: {
      placeholder: 'Lorem Ipsum: Wieviele sachen willst du hochladen',
      uploadProgess: 'Uploaded % of % files',
      uploadSuccess: 'Uploaded',
      uploadError: 'Not Uploaded',
    },
    placeholder: false,
  },
}

const Template: ComponentStory<typeof Component> = (args: any) => (
  <Component {...args} uploadFiles={args.placeholder ? [] : args.uploadFiles} />
)

export const DropPreview = Template.bind({})
