/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { i18n } from '@kbn/i18n';
import { OverviewPageParsingErrorCallout, StatusPanel } from '../components/functional';
import { useUptimeTelemetry, UptimePage, useGetUrlParams } from '../hooks';
import { stringifyUrlParams } from '../lib/helper/stringify_url_params';
import { useTrackPageview } from '../../../../../plugins/observability/public';
import { DataPublicPluginSetup, IIndexPattern } from '../../../../../../src/plugins/data/public';
import { EmptyState, FilterGroup, KueryBar, MonitorList } from '../components/connected';
import { useUpdateKueryString } from '../hooks';
import { PageHeader } from './page_header';
import { useBreadcrumbs } from '../hooks/use_breadcrumbs';

interface OverviewPageProps {
  autocomplete: DataPublicPluginSetup['autocomplete'];
  indexPattern: IIndexPattern | null;
  setEsKueryFilters: (esFilters: string) => void;
}

type Props = OverviewPageProps;

const EuiFlexItemStyled = styled(EuiFlexItem)`
  && {
    min-width: 598px;
    @media only screen and (max-width: 630px) {
      min-width: initial;
    }
  }
`;

export const OverviewPageComponent = ({ autocomplete, indexPattern, setEsKueryFilters }: Props) => {
  const { absoluteDateRangeStart, absoluteDateRangeEnd, ...params } = useGetUrlParams();
  const { search, filters: urlFilters } = params;

  useUptimeTelemetry(UptimePage.Overview);

  useTrackPageview({ app: 'uptime', path: 'overview' });
  useTrackPageview({ app: 'uptime', path: 'overview', delay: 15000 });

  const [esFilters, error] = useUpdateKueryString(indexPattern, search, urlFilters);

  useEffect(() => {
    setEsKueryFilters(esFilters ?? '');
  }, [esFilters, setEsKueryFilters]);

  const linkParameters = stringifyUrlParams(params, true);

  const heading = i18n.translate('xpack.uptime.overviewPage.headerText', {
    defaultMessage: 'Overview',
    description: `The text that will be displayed in the app's heading when the Overview page loads.`,
  });

  useBreadcrumbs([]); // No extra breadcrumbs on overview
  return (
    <>
      <PageHeader headingText={heading} extraLinks={true} datePicker={true} />
      <EmptyState>
        <EuiFlexGroup gutterSize="xs" wrap responsive>
          <EuiFlexItem grow={1} style={{ flexBasis: 500 }}>
            <KueryBar
              aria-label={i18n.translate('xpack.uptime.filterBar.ariaLabel', {
                defaultMessage: 'Input filter criteria for the overview page',
              })}
              autocomplete={autocomplete}
              data-test-subj="xpack.uptime.filterBar"
            />
          </EuiFlexItem>
          <EuiFlexItemStyled grow={true}>
            <FilterGroup esFilters={esFilters} />
          </EuiFlexItemStyled>
          {error && <OverviewPageParsingErrorCallout error={error} />}
        </EuiFlexGroup>
        <EuiSpacer size="s" />
        <StatusPanel />
        <EuiSpacer size="s" />
        <MonitorList filters={esFilters} linkParameters={linkParameters} />
      </EmptyState>
    </>
  );
};
