/********************************************************************************
 * Copyright (c) 2023 BMW Group AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
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

import { CardHorizontal, Typography } from '@catena-x/portal-shared-components'
import { Grid, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { ServiceRequest } from 'features/serviceMarketplace/serviceApiSlice'
import './style.scss'
import { useCallback } from 'react'
import { ServiceTypeIdsEnum } from 'features/serviceManagement/apiSlice'
import { getApiBase } from 'services/EnvironmentService'
import { fetchImageWithToken } from 'services/ImageService'

export default function ServicesElements({
  services,
}: {
  services: ServiceRequest[]
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const serviceReleaseTranslation = useTranslation('servicerelease').t

  const getServiceString = useCallback((ids: string[]) => {
    const newArr: string[] = []
    ids?.forEach((serviceString: string) => {
      if (serviceString === ServiceTypeIdsEnum.CONSULTANCY_SERVICE)
        newArr.push(serviceReleaseTranslation('consultancyService'))
      if (serviceString === ServiceTypeIdsEnum.DATASPACE_SERVICE)
        newArr.push(serviceReleaseTranslation('dataspaceService'))
    })
    return newArr.join(', ')
  }, [])

  const handleClick = (id: string) => {
    navigate(`/serviceMarketplaceDetail/${id}`)
  }

  return (
    <div className="services-main">
      <div className="mainContainer">
        <div className="mainRow">
          <Box className="services-section-main">
            <div className="services-section-content">
              <Typography
                sx={{ fontFamily: 'LibreFranklin-Light' }}
                variant="h3"
                className="section-title"
              >
                {t('content.serviceMarketplace.allServices')}
              </Typography>
            </div>
            <div className="services-container">
              <Grid container spacing={2} className="services-section">
                {services.map((service: ServiceRequest) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key={service.id}
                    className="services-card"
                  >
                    <CardHorizontal
                      borderRadius={6}
                      image={{
                        src: `${getApiBase()}/api/services/${service.id}/serviceDocuments/${service?.leadPictureId}`,
                        alt: 'App Card',
                        style: {
                          flex: '0 0 33.333333%',
                          maxWidth: '33.333333%',
                          minHeight: '200px',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        },
                      }}
                      imageLoader={fetchImageWithToken}
                      label={service.provider}
                      buttonText="Details"
                      onBtnClick={() => {
                        handleClick(service.id)
                      }}
                      title={service.title}
                      subTitle={getServiceString(service.serviceTypeIds ?? [])}
                      description={service.description}
                      backgroundColor="#fff"
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          </Box>
        </div>
      </div>
    </div>
  )
}
