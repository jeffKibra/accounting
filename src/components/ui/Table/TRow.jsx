import TR, { TRProps } from './TR';
import TD from './TD';

export default function TRow(props) {
  console.log({ TRowProps: props });

  return (
    <TR {...props}>
      {cells => {
        return cells.map(cell => {
          return <TD cell={cell} />;
        });
      }}
    </TR>
  );
}

TRow.propTypes = {
  ...TRProps,
};
