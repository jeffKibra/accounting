import VehicleModelOptions from 'containers/Management/VehicleModels/VehicleModelOptions';
//

export default function formatRowData(modelData, currentOrgId) {
  // console.log({ modelData });

  // delete row?.__typename;
  // delete row?.model?.__typename;
  const modelOrgId = modelData?.metaData?.orgId || '';

  const isOwner = modelOrgId === currentOrgId;

  return {
    ...modelData,
    isOwner: isOwner ? 'TRUE' : 'FALSE',
    actions: <VehicleModelOptions vehicleModel={modelData} edit deletion />,
  };
}
