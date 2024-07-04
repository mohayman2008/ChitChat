export async function updateById(id, newData) {
  try {
    const object = await this.findByPk(id);
    if (!object) {
      throw new Error(`${this.name} entry was not found`);
    }
    return object.update(newData);
  } catch (error) {
    console.error(`Error updating ${this.name} with id ${id}:`, error);
    throw error;
  }
}

export async function deleteById(id, forceDelete=false) {
  try {
    const object = await this.findByPk(id);
    if (!object) {
      throw new Error(`${this.name} entry was not found`);
    }
    const result = await object.destroy({ force: forceDelete });
    if (result.deletedAt !== null) return true;
    return false;
  } catch (error) {
    console.error(`Error deleting ${this.name} with id ${id}:`, error);
    throw error;
  }
}
