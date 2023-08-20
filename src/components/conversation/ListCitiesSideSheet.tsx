import React, { useEffect, useState } from 'react';
import { Paragraph, Accordion } from 'prixa-design-kit/dist';
import { getAPI } from '../../api/api-method';
import { DIAGNOSTIC_API } from '../../api/api-url';
import { LoadPage } from '../../wrappers/diagnostic/LoadPage';

interface CitiesType {
  id: string;
  Provinsi: string;
  Kota: string;
}

export const ListCitiesSideSheet = () => {
  const [listCities, setListCities] = useState<Array<CitiesType> | undefined>(undefined);
  useEffect(() => {
    getAPI(DIAGNOSTIC_API.LOCAL_TRANSMISSION).then((resp: any) => {
      setListCities(resp.data);
    });
  }, []);

  if (!listCities) return <LoadPage />;

  const accordionProvince = listCities.map(({ id, Provinsi, Kota }: CitiesType) => {
    const cities = Kota.split(', ');

    return (
      <Accordion key={id} title={Provinsi} className="padding-tinyB">
        <ol className="padding-smallL margin-none">
          {cities.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ol>
      </Accordion>
    );
  });

  return (
    <div className="prixa-container is-top margin-largeB padding-largeX" data-cy="infection-covid-cities">
      <Paragraph scale="caption" className="prixa-title-long-sub">
        Daftar ini terus diperbaharui seiring perkembangan sebaran virus Corona di Indonesia. <br />
        (Daftar kota berdasar data{' '}
        <a
          href="https://covid19.kemkes.go.id/category/situasi-infeksi-emerging/info-corona-virus/"
          target="_blank"
          style={{ textDecoration: 'underline' }}
          rel="noopener noreferrer"
        >
          Kemenkes
        </a>
        )
      </Paragraph>

      {accordionProvince}
    </div>
  );
};
