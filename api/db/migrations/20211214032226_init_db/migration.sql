-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "videoUrl" TEXT,
    "currentTime" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
