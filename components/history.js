// Constructor function
function History(createdAt, createdBy, name) {
  this.createdAt = createdAt;
  this.createdBy = createdBy;
  this.name = name;

  return {
    createdAt: this.createdAt,
    createdBy: this.createdBy,
    name: this.name,
  };
}