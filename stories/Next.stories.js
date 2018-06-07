import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  HitsRenderer,
  Highlight,
  RefinementList,
  SearchBox,
  createWidget,
} from 'react-instantsearch-next';

const stories = storiesOf('<Next>', module);
const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');

stories
  .add('default', () => (
    <InstantSearch searchClient={client} indexName="instant_search">
      <SearchBox />
      <RefinementList attribute="categories" />
      <Hits />
    </InstantSearch>
  ))
  .add('single Hit render', () => (
    <InstantSearch searchClient={client} indexName="instant_search">
      <SearchBox />
      <RefinementList attribute="categories" />
      <Hits
        renderHit={hit => (
          <Fragment>
            <p>objectID: {hit.objectID}</p>
            <p>
              name: <Highlight hit={hit} attribute="name" />
            </p>
          </Fragment>
        )}
      />
    </InstantSearch>
  ))
  .add('full Hits render', () => (
    <InstantSearch searchClient={client} indexName="instant_search">
      <SearchBox />
      <RefinementList attribute="categories" />
      <HitsRenderer>
        {({ hits }) => (
          <ol>
            {hits.map(hit => (
              <li key={hit.objectID} className="ais-Hits-item">
                <p>objectID: {hit.objectID}</p>
                <p>
                  name: <Highlight hit={hit} attribute="name" />
                </p>
              </li>
            ))}
          </ol>
        )}
      </HitsRenderer>
    </InstantSearch>
  ))
  .add('custom widget', () => {
    const CustomWidget = createWidget({
      widget: {
        render({ state, helper }) {
          const refine = () => {
            const next = state.query === '' ? 'Apple' : '';

            helper.setQuery(next).search();
          };

          return {
            currentRefinement: state.query,
            refine,
          };
        },
      },
    });

    return (
      <InstantSearch searchClient={client} indexName="instant_search">
        <SearchBox />
        <RefinementList attribute="categories" />
        <CustomWidget>
          {({ refine, currentRefinement }) => (
            <p>
              <button onClick={refine}>
                {currentRefinement ? 'Clear' : 'Search for "Apple"'}
              </button>
            </p>
          )}
        </CustomWidget>
      </InstantSearch>
    );
  });
