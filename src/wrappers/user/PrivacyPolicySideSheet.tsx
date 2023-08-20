import React, { useEffect, useState } from 'react';
import { getAPI } from '../../api/api-method';
import { USER_API } from '../../api/api-url';
import { Paragraph } from 'prixa-design-kit/dist';

const PrivacyPolicySideSheet = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState('');

  async function getData() {
    await getAPI(USER_API.CONSENT).then((res: any) => {
      setPrivacyPolicy(res.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  const privacyPolicyText: any = [];

  if (privacyPolicy) {
    privacyPolicy.split('\\n').forEach((item: any, key: number) => {
      privacyPolicyText.push(item);
    });
  }

  return (
    <div className="prixa-container is-top margin-largeB padding-largeX">
      {privacyPolicyText.length > 0
        ? privacyPolicyText.map((item: any, key: number) => {
            return (
              <Paragraph key={key} scale="content">
                {item}
              </Paragraph>
            );
          })
        : ''}
    </div>
  );
};

export default PrivacyPolicySideSheet;
