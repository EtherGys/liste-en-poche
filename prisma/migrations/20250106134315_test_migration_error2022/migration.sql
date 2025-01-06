-- CreateTable
CREATE TABLE `articles` (
    `id_article` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(50) NULL,
    `acheter` BOOLEAN NULL,

    PRIMARY KEY (`id_article`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contiens` (
    `id_liste` INTEGER NOT NULL,
    `id_article` INTEGER NOT NULL,
    `qte` INTEGER NULL DEFAULT 1,

    INDEX `id_article_idx`(`id_article`),
    INDEX `list`(`id_liste`),
    PRIMARY KEY (`id_liste`, `id_article`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listes` (
    `id_liste` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(50) NULL,
    `date_creation` DATETIME(0) NULL,
    `date_modification` DATETIME(0) NULL,
    `createur` INTEGER NULL,
    `modificateur` INTEGER NULL,

    PRIMARY KEY (`id_liste`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `possede` (
    `id_utilisateur` INTEGER NOT NULL,
    `id_liste` INTEGER NOT NULL,

    INDEX `id_liste_idx`(`id_liste`),
    PRIMARY KEY (`id_utilisateur`, `id_liste`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateurs` (
    `id_utilisateur` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(50) NULL,
    `prenom` VARCHAR(50) NULL,
    `mail` VARCHAR(50) NULL,
    `mdp` VARCHAR(50) NULL,

    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contiens` ADD CONSTRAINT `id_article` FOREIGN KEY (`id_article`) REFERENCES `articles`(`id_article`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contiens` ADD CONSTRAINT `id_liste` FOREIGN KEY (`id_liste`) REFERENCES `listes`(`id_liste`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `possede` ADD CONSTRAINT `id_listes` FOREIGN KEY (`id_liste`) REFERENCES `listes`(`id_liste`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `possede` ADD CONSTRAINT `id_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE NO ACTION ON UPDATE NO ACTION;
