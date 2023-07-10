/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { createRef } from 'react';
import { styled, formatNumber } from '@superset-ui/core';
import { Card, Row, Col } from 'antd';
import { SupersetPluginChartCustomTableProps, SupersetPluginChartCustomTableStylesProps } from './types';

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<SupersetPluginChartCustomTableStylesProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;

  .card-titulo {
    font-size: ${({ theme, headerFontSize }) => theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) => theme.typography.weights[boldText ? 'bold' : 'normal']};
  }
`;

export default function SupersetPluginChartCustomTable(props: SupersetPluginChartCustomTableProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, cols, height, width,  colsLabels,  metrics, numberFormat, cardsByRow } = props;

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to access the DOM and do whatever you want.
  // Here, you can do that with createRef, and the useEffect hook.
  // useEffect(() => {
  //   const root = rootElem.current as HTMLElement;
  //   console.log('Plugin element', root);
  // });

  function getRgbaColor(d3RgbaColor: any) {
    return 'rgba(' +d3RgbaColor.r +','+d3RgbaColor.g +','+d3RgbaColor.b +','+d3RgbaColor.a +')';
  }

  function getCards(): any[][]  {
    const cards: any[] = [];
    let linha = 0;
    let coluna = 0;
    cards[linha] = [];
    for (let index = 0; index < data.length; index++) {
      if (cards[linha] === undefined) cards[linha] = [];
      cards[linha][coluna] = data[index];
      coluna++
      if(coluna+1>cardsByRow) {
        linha++
        coluna=0
      }
    }
    return cards;
  }

  function colsGroupConcat(group: any): string | undefined  {
    if (cols.length === 1)  return group[cols[0]] as string;
    return cols.reduce((prev,cur) => group[prev] + ' - ' + group[cur] as string);
  };
// TODO:
//   cor de backgroun do card-header
//        card-body
// cor do titulo
// font do titulo
// mais de um card por linha

// export type InternalControlType =
//   | 'AnnotationLayerControl'
//   | 'BoundsControl'
//   | 'CheckboxControl'
//   | 'CollectionControl'
//   | 'ColorPickerControl'
//   | 'ColorSchemeControl'
//   | 'DatasourceControl'
//   | 'DateFilterControl'
//   | 'FixedOrMetricControl'
//   | 'HiddenControl'
//   | 'SelectAsyncControl'
//   | 'SelectControl'
//   | 'SliderControl'
//   | 'SpatialControl'
//   | 'TextAreaControl'
//   | 'TextControl'
//   | 'TimeSeriesColumnControl'
//   | 'ViewportControl'
//   | 'VizTypeControl'
//   | 'MetricsControl'
//   | 'AdhocFilterControl'
//   | 'FilterBoxItemControl'
//   | 'DndColumnSelect'
//   | 'DndFilterSelect'
//   | 'DndMetricSelect'


  return (
    <Styles
      ref={rootElem}
      width={width}
      height={height}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      cols={cols} colsLabels={colsLabels} metrics={metrics} >
      {getCards().map((groupRow, indexGroupRow) => ( 
        <Row key={indexGroupRow} gutter={12}>
          {groupRow.map((group, indexGroup) => (
            <Col key={indexGroup} span={24/cardsByRow}>
              <Card 
                key={indexGroup} 
                title={<span className='card-titulo'>{colsGroupConcat(group)}</span>} 
                bordered={true} 
                headStyle={{backgroundColor: getRgbaColor(props.headerBackgroundColor)}} 
                bodyStyle={{backgroundColor: getRgbaColor(props.bodyBackgroundColor)}} 
                style={{ width: 'auto', marginBottom: "10px" }}>

                {metrics.map((metric, index) => (
                  <>
                  { group[colsLabels[index]] !== null && (
                  <Row key={index}>
                    <Col flex={2}>{group[colsLabels[index]]}</Col>
                    <Col style={{textAlign: "right", fontFamily: "monospace"}} flex={1}>{formatNumber(numberFormat, group[metric.label ? metric.label : metric] as number)}</Col>
                  </Row>
                  )
                  }
                  </>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </Styles>
  );
}
