/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Fragment } from 'react';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { getLayerWizards } from '../../../../../../../plugins/maps/public/layers/layer_wizard_registry';
import { EuiTitle, EuiSpacer, EuiCard, EuiIcon } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import _ from 'lodash';

export function SourceSelect({ updateSourceSelection }) {
  const sourceCards = getLayerWizards().map(layerWizard => {
    const icon = layerWizard.icon ? <EuiIcon type={layerWizard.icon} size="l" /> : null;

    const onClick = () => {
      updateSourceSelection({
        layerWizard: layerWizard,
        isIndexingSource: !!layerWizard.isIndexingSource,
      });
    };

    return (
      <Fragment key={layerWizard.title}>
        <EuiSpacer size="s" />
        <EuiCard
          className="mapLayerAddpanel__card"
          title={layerWizard.title}
          icon={icon}
          onClick={onClick}
          description={layerWizard.description}
          layout="horizontal"
          data-test-subj={_.camelCase(layerWizard.title)}
        />
      </Fragment>
    );
  });

  return (
    <Fragment>
      <EuiTitle size="xs">
        <h2>
          <FormattedMessage
            id="xpack.maps.addLayerPanel.chooseDataSourceTitle"
            defaultMessage="Choose data source"
          />
        </h2>
      </EuiTitle>
      {sourceCards}
    </Fragment>
  );
}
