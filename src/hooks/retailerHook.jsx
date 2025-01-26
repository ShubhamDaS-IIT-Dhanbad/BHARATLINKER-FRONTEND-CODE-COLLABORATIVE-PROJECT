const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const { id, ...shopDetails } = formData;
      const newFiles = images.filter((image) => image !== null);
      const fetchShopData=await updateShopData(id,toDeleteImagesUrls,shopDetails,newFiles);
      console.log(fetchShopData,"bharatlinker");
      refreshShopData(fetchShopData);
    } catch (error) {
      console.error('Error updating shop:', error);
    } finally {
      setIsUpdating(false);
    }
  };