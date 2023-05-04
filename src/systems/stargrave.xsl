<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:bs="http://www.battlescribe.net/schema/rosterSchema"
                xmlns:exslt="http://exslt.org/common"
                extension-element-prefixes="exslt">
    <!--    <xsl:output method="html" indent="yes"/>-->

    <xsl:template match="bs:roster/bs:forces/bs:force">
        <xsl:apply-templates select="bs:selections/bs:selection[@type='model']"/>
    </xsl:template>

    <xsl:template match="bs:profile[@typeName='Weapon']">
        <li>
            <div class="flex flex-row justify-between">
                <div class="basis-1/2">
                    <xsl:value-of select="@name"/>
                </div>
                <div class="basis-1/4 text-center">
                    <xsl:value-of select="bs:characteristics/bs:characteristic[@name='Max Range']/."/>
                </div>
                <div class="basis-1/4 text-center">
                    <xsl:value-of select="bs:characteristics/bs:characteristic[@name='Damage Modifier']/."/>
                </div>
            </div>
        </li>
    </xsl:template>

    <xsl:template match="bs:profile[@typeName='Equipment']">
        <li>
            <xsl:value-of select="@name"/>
        </li>
    </xsl:template>

    <xsl:template match="bs:profile[@typeName='Power']">
        <li>
            <xsl:value-of select="@name"/>
        </li>
    </xsl:template>

    <xsl:template match="bs:selection[@type='model']">
        <div class="w-60 h-[21rem] bg-white border-solid border border-black m-2 text-xs font-mono print:break-inside-avoid">
            <div class="flex items-center justify-between font-semibold">
                <div class="py-1 px-2">NAME</div>
                <xsl:choose>
                    <xsl:when test="contains('Captain|First Mate', bs:categories/bs:category[@primary='true']/@name)">
                        <div class="py-1 px-2 rounded-bl-lg bg-red-600 text-white">
                            <xsl:value-of select="bs:selections/bs:selection[@name='Level']/@number"/>
                        </div>
                    </xsl:when>
                    <xsl:otherwise>
                        <div class="py-1 px-2 rounded-bl-lg bg-sky-800 text-white">
                            <xsl:value-of select="format-number(bs:costs/bs:cost[@name='Cr']/@value, '#')"/>
                        </div>
                    </xsl:otherwise>
                </xsl:choose>
            </div>
            <div class="flex">
                <div class="basis-2/5 italic">
                    <table class="table-auto font-semibold w-full">
                        <tr class="even:bg-gray-200">
                            <td class="text-right">MOVE</td>
                            <td class="text-right pr-3">
                                <xsl:value-of
                                        select="bs:profiles/bs:profile/bs:characteristics/bs:characteristic[@name='M']"/>
                            </td>
                        </tr>
                        <tr class="even:bg-gray-200">
                            <td class="text-right">FIGHT</td>
                            <td class="text-right pr-3">
                                <xsl:value-of
                                        select="bs:profiles/bs:profile/bs:characteristics/bs:characteristic[@name='F']"/>
                            </td>
                        </tr>
                        <tr class="even:bg-gray-200">
                            <td class="text-right">SHOOT</td>
                            <td class="text-right pr-3">
                                <xsl:value-of
                                        select="bs:profiles/bs:profile/bs:characteristics/bs:characteristic[@name='S']"/>
                            </td>
                        </tr>
                        <tr class="even:bg-gray-200">
                            <td class="text-right">ARMOUR</td>
                            <td class="text-right pr-3">
                                <xsl:value-of
                                        select="bs:profiles/bs:profile/bs:characteristics/bs:characteristic[@name='A']"/>
                            </td>
                        </tr>
                        <tr class="even:bg-gray-200">
                            <td class="text-right">WILL</td>
                            <td class="text-right pr-3">
                                <xsl:value-of
                                        select="bs:profiles/bs:profile/bs:characteristics/bs:characteristic[@name='W']"/>
                            </td>
                        </tr>
                        <tr class="even:bg-gray-200">
                            <td class="text-right">HEALTH</td>
                            <td class="text-right pr-3">
                                <xsl:value-of
                                        select="bs:profiles/bs:profile/bs:characteristics/bs:characteristic[@name='H']"/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="basis-3/5 flex flex-row items-end justify-between">
                    <div class="border border-solid border-black w-7 h-[1.1rem]"/>
                    <div class="font-semibold pr-2 uppercase">
                        <xsl:value-of select="@name"/>
                    </div>
                </div>
            </div>
            <div class="my-2">
                <div class="align-middle px-3 py-0.5 font-semibold text-[0.6rem] bg-sky-800 text-white print:text-black print:bg-gray-200">WEAPONS
                    &amp; EQUIPMENT
                </div>
                <div class="mx-6 my-1 text-[0.5rem]/3 uppercase">
                    <ul class="list-disc">
                        <xsl:apply-templates
                                select="bs:selections/bs:selection/bs:profiles/bs:profile[@typeName='Weapon']"/>
                        <xsl:apply-templates
                                select="bs:selections/bs:selection/bs:profiles/bs:profile[@typeName='Equipment']"/>
                    </ul>
                </div>
            </div>

            <xsl:if test="contains('Captain|First Mate', bs:categories/bs:category[@primary='true']/@name)">
                <div class="my-2">
                    <div class="align-middle px-3 py-0.5 font-semibold text-[0.6rem] bg-sky-800 text-white print:text-black print:bg-gray-200">
                        POWERS
                    </div>
                    <div class="mx-6 my-1 text-[0.5rem]/3 uppercase">
                        <ul class="list-disc">
                            <xsl:apply-templates
                                    select="bs:selections/bs:selection/bs:profiles/bs:profile[@typeName='Power']"/>
                        </ul>
                    </div>
                </div>
            </xsl:if>
        </div>
    </xsl:template>
</xsl:stylesheet>
