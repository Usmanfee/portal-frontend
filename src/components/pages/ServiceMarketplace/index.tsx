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

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ChangeEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import debounce from 'lodash.debounce'
import ServicesElements from './ServicesElements'
import RecommendedServices from './RecommendedServices'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import relativeTime from 'dayjs/plugin/relativeTime'
import './ServiceMarketplace.scss'
import {
  SearchInput,
  Typography,
  ViewSelector,
  SortOption,
  CircleProgress,
  ErrorBar,
  LoadMoreButton,
} from '@catena-x/portal-shared-components'
import {
  type ServiceRequest,
  useFetchServicesQuery,
} from 'features/serviceMarketplace/serviceApiSlice'
import SortImage from 'components/shared/frame/SortImage'
import { ServiceTypeIdsEnum } from 'features/serviceManagement/apiSlice'
import NoItems from '../NoItems'
import { appToCard } from 'features/apps/mapper'
import type { AppMarketplaceApp, ProvidedApps } from 'features/apps/types'

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)

export default function ServiceMarketplace() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [searchExpr, setSearchExpr] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>('All Services')
  const [sortOption, setSortOption] = useState<string>('new')
  const [cardServices, setCardServices] = useState<ServiceRequest[]>([])
  const [page, setPage] = useState<number>(0)
  const [group, setGroup] = useState<string>('')
  const [serviceTypeId, setServiceTypeId] = useState<
    string | keyof ServiceTypeIdsEnum
  >('')
  const [sortingType, setSortingType] = useState<string>('ReleaseDateDesc')
  const [argsData, setArgsData] = useState({
    page: 0,
    serviceType: serviceTypeId,
    sortingType,
  })

  useEffect(() => {
    if (selected === ServiceTypeIdsEnum.DATASPACE_SERVICES) {
      setServiceTypeId(ServiceTypeIdsEnum.DATASPACE_SERVICE)
    } else if (selected === ServiceTypeIdsEnum.CONSULTANCY_SERVICES) {
      setServiceTypeId(ServiceTypeIdsEnum.CONSULTANCY_SERVICE)
    }
  }, [selected])

  useEffect(() => {
    if (sortOption === 'provider') {
      setSortingType('ProviderDesc')
    }
  }, [sortOption])

  // let serviceTypeId = ''

  // if (selected === ServiceTypeIdsEnum.DATASPACE_SERVICES) {
  //   serviceTypeId = ServiceTypeIdsEnum.DATASPACE_SERVICE
  // } else if (selected === ServiceTypeIdsEnum.CONSULTANCY_SERVICES) {
  //   serviceTypeId = ServiceTypeIdsEnum.CONSULTANCY_SERVICE
  // }

  // let sortingType = 'ReleaseDateDesc'
  // if (sortOption === 'provider') {
  //   sortingType = 'ProviderDesc'
  // }

  const indexToSplit = 2 //show only 2 services in recommended

  const { data, error, isError, refetch } = useFetchServicesQuery(
    argsData as any
  )
  const services = data?.content

  // console.log('services:', services)

  // To-Do fix the type issue with status and data from FetchBaseQueryError
  // eslint-disable-next-line
  const servicesError = error as any

  // useEffect(() => {
  //   services && setCardServices(() => [...services])
  // }, [services])

  useEffect(() => {
    if (data?.content)
      setCardServices(
        data?.meta.page === 0
          ? setDataInfo(data)
          : (i: ServiceRequest[]) => i.concat(setDataInfo(data))
      )
  }, [data])

  const setDataInfo = (data: ProvidedApps) =>
    data.content.map((item: AppMarketplaceApp) => appToCard(item))

  const setView = (e: React.MouseEvent<HTMLInputElement>) => {
    const viewValue = e.currentTarget.value
    setSelected(viewValue)
    setGroup(viewValue)
    // setArgsData({
    //   page: 0,
    //   args: {
    //     expr: '',
    //     statusFilter: viewValue,
    //   },
    // })
    setPage(0)
  }

  const sortOptions = [
    {
      label: t('content.serviceMarketplace.sortOptions.new'),
      value: 'new',
    },
    {
      label: t('content.serviceMarketplace.sortOptions.provider'),
      value: 'provider',
    },
  ]

  const filterButtons = [
    {
      buttonText: t('content.serviceMarketplace.tabs.all'),
      buttonValue: t('content.serviceMarketplace.tabs.all'),
      onButtonClick: setView,
    },
    {
      buttonText: t('content.serviceMarketplace.tabs.dataspaceService'),
      buttonValue: t('content.serviceMarketplace.tabs.dataspaceService'),
      onButtonClick: setView,
    },
    {
      buttonText: t('content.serviceMarketplace.tabs.consultancyService'),
      buttonValue: t('content.serviceMarketplace.tabs.consultancyService'),
      onButtonClick: setView,
    },
  ]

  const debouncedFilter = useMemo(
    () =>
      debounce((expr: string) => {
        services &&
          setCardServices(
            expr
              ? services?.filter(
                  (card: ServiceRequest) =>
                    card.title.toLowerCase().includes(expr.toLowerCase()) ||
                    card.provider.toLowerCase().includes(expr.toLowerCase()) ||
                    card?.description.toLowerCase().includes(expr.toLowerCase())
                )
              : services
          )
      }, 300),
    [services]
  )

  const doFilter = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const expr = event.target.value

      setSearchExpr(expr)
      debouncedFilter(expr)
    },
    [debouncedFilter]
  )

  const setSortOptionFn = useCallback((value: string) => {
    setSortOption(value)
    setShowModal(false)
  }, [])

  const setModalFalse = useCallback(() => {
    setShowModal(false)
  }, [])

  const setModalTrue = useCallback(() => {
    setShowModal(true)
  }, [])

  const renderServices = () => {
    if (services && services.length === 0) return <NoItems />
    if (!services)
      return (
        <div className="loading-progress">
          <CircleProgress
            variant="indeterminate"
            colorVariant="primary"
            size={50}
            sx={{
              color: theme.palette.primary.main,
            }}
          />
        </div>
      )
    return (
      <RecommendedServices services={cardServices?.slice(0, indexToSplit)} />
    )
  }

  const nextPage = () => {
    setArgsData({
      ...argsData,
      page: page + 1,
    })
    setPage(page + 1)
  }

  return (
    <main className="serviceMarketplace">
      <div className="mainContainer">
        <div className="mainRow">
          <Typography className="newServicesTitle" variant="h2">
            {t('content.serviceMarketplace.newServices')}
          </Typography>
          <Typography className="recommendationsTitle" variant="body1">
            {t('content.serviceMarketplace.recommendations')}
          </Typography>
          <div>
            <div className="searchContainer">
              <SearchInput
                placeholder={t('notification.search')}
                value={searchExpr}
                autoFocus={false}
                onChange={doFilter}
              />
            </div>
            <div className="filterSection" onMouseLeave={setModalFalse}>
              <ViewSelector activeView={selected} views={filterButtons} />
              <SortImage onClick={setModalTrue} selected={showModal} />
              <div className="sortSection">
                <SortOption
                  show={showModal}
                  selectedOption={sortOption}
                  setSortOption={setSortOptionFn}
                  sortOptions={sortOptions}
                />
              </div>
            </div>
            {!isError ? (
              renderServices()
            ) : (
              <ErrorBar
                errorText={
                  servicesError?.data?.status >= 400 &&
                  servicesError?.data?.status < 500
                    ? t('content.serviceMarketplace.dataLoadFailed')
                    : t('content.serviceMarketplace.loadFailed')
                }
                showButton={
                  servicesError.code >= 500 && servicesError?.data?.status < 600
                }
                buttonText={t('error.tryAgain')}
                handleButton={refetch}
              />
            )}
          </div>
        </div>
      </div>
      {cardServices && cardServices.length > 2 && (
        <ServicesElements services={cardServices.slice(indexToSplit)} />
      )}
      <div className="load-more-btn">
        {data?.meta && data?.meta?.totalPages > page + 1 && (
          <LoadMoreButton onClick={nextPage} label={t('loadmore')} />
        )}
      </div>
    </main>
  )
}
