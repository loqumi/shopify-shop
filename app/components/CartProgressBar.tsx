import AvocadoIcon from '~/ui/AvocadoIcon';

type CartProgressBarProps = {
  totalAvocados: number;
  prevAvocados?: number;
  newAvocados?: number;
};

export function CartProgressBar({
  totalAvocados,
  prevAvocados,
  newAvocados,
}: CartProgressBarProps) {
  if (!newAvocados || !prevAvocados) return;
  const percentagePrevAvocados = (prevAvocados / totalAvocados) * 100;
  const percentageNewAvocados = (newAvocados / totalAvocados) * 100;

  return (
    <>
      <div className={'flex gap-4 justify-between'}>
        <div className={'flex gap-4 max-md:justify-between max-md:w-full'}>
          <h2 className={'font-fraunces font-black uppercase'}>Avocados</h2>
          <div
            className={
              'flex rounded-full bg-main-green h-[33px] overflow-hidden'
            }
          >
            <div
              className={
                'flex font-noto font-semibold bg-dark-pink-two text-white p-2 items-center h-full rounded-full'
              }
            >
              {prevAvocados}&nbsp;
              <AvocadoIcon color={'green'} />
            </div>
            <div
              className={'flex font-noto font-semibold items-center p-2 h-full'}
            >
              {`+${newAvocados}`}&nbsp;
              <AvocadoIcon color={'pink'} />
            </div>
          </div>
        </div>
        <p
          className={
            'max-md:hidden flex !p-2 rounded-full bg-white h-[33px] font-noto font-semibold items-center'
          }
        >
          total remaining: {totalAvocados}
          &nbsp;
          <AvocadoIcon color={'green'} />
        </p>
      </div>

      <div className="overflow-hidden rounded-full h-[22px] flex bg-white w-full">
        <div
          style={{width: `${percentagePrevAvocados}%`}}
          className={`bg-dark-pink-two h-full `}
        ></div>
        <div
          style={{width: `${percentageNewAvocados}% `}}
          className={`bg-main-green h-full `}
        ></div>
      </div>

      <div className={'justify-end max-md:flex hidden'}>
        <p
          className={
            'flex !mt-4 w-[60%]  !p-2 rounded-full bg-white h-[33px] font-noto font-semibold items-center'
          }
        >
          total remaining: {totalAvocados}
          &nbsp;
          <AvocadoIcon color={'green'} />
        </p>
      </div>
    </>
  );
}
