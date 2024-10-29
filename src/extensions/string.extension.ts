export default String.prototype.isEmpty = function (): boolean {
    return this.length === 0;
};

// Declare the method in a global augmentation
declare global {
    interface String {
        isEmpty(): boolean
    }
}
