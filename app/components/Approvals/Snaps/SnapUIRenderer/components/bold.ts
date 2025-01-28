import { BoldElement, JSXElement } from '@metamask/snaps-sdk/jsx';
import { getJsxChildren } from '@metamask/snaps-utils';
import { NonEmptyArray } from '@metamask/utils';
import { mapTextToTemplate } from '../utils';
import { UIComponentFactory } from './types';
import { TextVariant } from '../../../../../component-library/components/Texts/Text';
import { TextColor } from '../../../../../component-library/components/Texts/Text/Text.types';

export const bold: UIComponentFactory<BoldElement> = ({
  element,
  ...params
}) => ({
  element: 'Text',
  children: mapTextToTemplate(
    getJsxChildren(element) as NonEmptyArray<string | JSXElement>,
    params,
  ),
  props: {
    variant: TextVariant.BodyMD,
    color: TextColor.Default,
    as: 'b',
  },
});
