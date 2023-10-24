class Services {
  async create(model, data, session = null) {
    try {
      if (session) {
        return await model.create([data], { session });
      }
      return await model.create(data);
    } catch (error) {
      throw error;
    }
  }

  async find(model, query, session = null) {
    try {
      if (session) {
        return await model.find(query).session(session);
      }
      return await model.find(query);
    } catch (error) {
      throw error;
    }
  }

  async findOne(model, query, session = null) {
    try {
      if (session) {
        return await model.findOne(query).session(session);
      }
      return await model.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  async findOneAndUpdate(model, filter, updateData, session = null) {
    try {
      if (session) {
        return await model.findOneAndUpdate(filter, updateData, {
          new: true,
          session,
        });
      }
      return await model.findOneAndUpdate(filter, updateData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async updateOne(model, filter, updateData, session = null) {
    try {
      if (session) {
        return await model.updateOne(filter, updateData, { session });
      }
      return await model.updateOne(filter, updateData);
    } catch (error) {
      throw error;
    }
  }

  async delete(model, filter, session = null) {
    try {
      if (session) {
        return await model.deleteOne(filter, { session });
      }
      return await model.deleteOne(filter);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Services;
