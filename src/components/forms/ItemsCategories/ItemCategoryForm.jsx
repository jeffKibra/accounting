import { useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

import Card, { CardContent } from "../../ui/Card";

function ItemCategoryForm(props) {
  const { loading, handleFormSubmit, category } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...category },
  });

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl isDisabled={loading} isInvalid={errors.categoryName}>
            <FormLabel>Category Name</FormLabel>
            <Input
              {...register("categoryName", {
                required: { value: true, message: "*Required" },
              })}
            />
          </FormControl>
          <FormControl
            isDisabled={loading}
            isInvalid={errors.categoryDescription}
          >
            <FormLabel htmlFor="categoryDescription">
              Category Description
            </FormLabel>
            <Textarea
              id="categoryDescription"
              {...register("categoryDescription")}
            />
          </FormControl>
          <Button
            colorScheme="cyan"
            isLoading={loading}
            mt="24px"
            type="submit"
          >
            save category
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

ItemCategoryForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  category: PropTypes.shape({
    categoryName: PropTypes.string,
    categoryDescription: PropTypes.string,
  }),
};

export default ItemCategoryForm;
