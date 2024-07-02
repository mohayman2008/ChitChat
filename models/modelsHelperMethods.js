export async function updateById(id, newData) {
  try {
    const object = await this.findByPk(id);
    if (!object) {
      throw new Error(`${this.name} entry was not found`);
    }
    await object.update(newData);
    return object;
  } catch (error) {
    console.error(`Error updating ${this.name} with id ${id}:`, error);
    throw error;
  }
}

export async function deleteById(id) {
  try {
    const object = await this.findByPk(id);
    if (!object) {
      throw new Error(`${this.name} entry was not found`);
    }
    if (object.deletedAt !== null) return true;
    return false;
  } catch (error) {
    console.error(`Error deleting ${this.name} with id ${id}:`, error);
    throw error;
  }
}
