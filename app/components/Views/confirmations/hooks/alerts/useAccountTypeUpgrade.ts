import { useMemo } from 'react';

import { strings } from '../../../../../../locales/i18n';
import { Alert, Severity } from '../../types/alerts';
import { RowAlertKey } from '../../components/UI/info-row/alert-row/constants';
import { use7702TransactionType } from '../7702/use7702TransactionType';

export function useAccountTypeUpgrade(): Alert[] {
  const { isBatchedUpgrade } = use7702TransactionType();

  return useMemo(() => {
    if (!isBatchedUpgrade) {
      return [];
    }

    return [
      {
        field: RowAlertKey.AccountTypeUpgrade,
        key: RowAlertKey.AccountTypeUpgrade,
        // content: 'upgrade',
        reason: strings('alertAccountTypeUpgradeTitle'),
        severity: Severity.Info,
        title: 'title',
        message: 'message',
      },
    ];
  }, [isBatchedUpgrade]);
}
