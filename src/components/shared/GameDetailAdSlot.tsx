import { AdSense } from './AdSense';

type Props = {
  slug: string;
};

/**
 * Single game-detail ad shell: same markup for info row + right sidebar.
 */
export function GameDetailAdSlot({ slug }: Props) {
  return (
    <div className="ad game-detail-ad">
      <p>Advertisement</p>
      <div>
        <AdSense key={slug} />
      </div>
    </div>
  );
}
